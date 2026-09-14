import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', app: 'RWimóveis', timestamp: new Date().toISOString() });
  });

  // Authentication with bcrypt password verification
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Usuário e senha são obrigatórios.'
        });
      }

      const { valid, user } = db.verifyAdminCredentials(username, password);

      if (valid && user) {
        return res.json({
          success: true,
          user: {
            username: user.username,
            name: user.name,
            role: user.role
          },
          token: 'rw-token-admin-' + Date.now()
        });
      }

      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas. Verifique o usuário e a senha.'
      });
    } catch (err: any) {
      console.error('Error in /api/auth/login:', err);
      return res.status(500).json({
        success: false,
        error: 'Erro no servidor ao processar autenticação.'
      });
    }
  });

  // Properties list
  app.get('/api/properties', (req: Request, res: Response) => {
    try {
      const { purpose, type, query, featured, minPrice, maxPrice } = req.query;
      const properties = db.getProperties({
        purpose: purpose as string,
        type: type as string,
        query: query as string,
        featured: featured !== undefined ? featured === 'true' : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined
      });
      res.json(properties);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      res.status(500).json({ error: 'Erro ao buscar anúncios de imóveis' });
    }
  });

  // Single Property details & auto-track visit
  app.get('/api/properties/:id', (req: Request, res: Response) => {
    try {
      const property = db.getPropertyById(req.params.id);
      if (!property) {
        return res.status(404).json({ error: 'Imóvel não encontrado' });
      }

      // Automatically register a view / visit in the database
      const userAgent = req.headers['user-agent'] || 'Browser';
      const isMobile = /mobile|iphone|android/i.test(userAgent);
      db.recordVisit(property.id, {
        userAgent,
        city: property.city,
        device: isMobile ? 'Mobile' : 'Desktop',
        referrer: (req.headers['referer'] as string) || 'Direto'
      });

      res.json(property);
    } catch (err: any) {
      console.error('Error fetching property:', err);
      res.status(500).json({ error: 'Erro ao carregar detalhes do imóvel' });
    }
  });

  // Create property (Admin)
  app.post('/api/properties', (req: Request, res: Response) => {
    try {
      const { title, type, purpose, price, address, neighborhood, city, state, area } = req.body;
      if (!title || !type || !purpose || !price || !city || !area) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
      }

      const newProperty = db.createProperty(req.body);
      res.status(201).json(newProperty);
    } catch (err: any) {
      console.error('Error creating property:', err);
      res.status(500).json({ error: 'Erro ao cadastrar novo anúncio' });
    }
  });

  // Update property (Admin)
  app.put('/api/properties/:id', (req: Request, res: Response) => {
    try {
      const updated = db.updateProperty(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Imóvel não encontrado para atualização' });
      }
      res.json(updated);
    } catch (err: any) {
      console.error('Error updating property:', err);
      res.status(500).json({ error: 'Erro ao atualizar anúncio' });
    }
  });

  // Delete property (Admin)
  app.delete('/api/properties/:id', (req: Request, res: Response) => {
    try {
      const deleted = db.deleteProperty(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Imóvel não encontrado para exclusão' });
      }
      res.json({ success: true, message: 'Anúncio excluído com sucesso do banco de dados' });
    } catch (err: any) {
      console.error('Error deleting property:', err);
      res.status(500).json({ error: 'Erro ao excluir anúncio' });
    }
  });

  // Track explicit visit
  app.post('/api/visits', (req: Request, res: Response) => {
    try {
      const { propertyId, city } = req.body;
      if (!propertyId) {
        return res.status(400).json({ error: 'ID do imóvel é obrigatório' });
      }

      const userAgent = req.headers['user-agent'] || 'Browser';
      const isMobile = /mobile|iphone|android/i.test(userAgent);
      const result = db.recordVisit(propertyId, {
        userAgent,
        city,
        device: isMobile ? 'Mobile' : 'Desktop',
        referrer: (req.headers['referer'] as string) || 'Direto'
      });

      if (!result) {
        return res.status(404).json({ error: 'Imóvel não encontrado para registrar visita' });
      }

      res.json({ success: true, viewsCount: result.property.viewsCount, visit: result.visit });
    } catch (err: any) {
      console.error('Error recording visit:', err);
      res.status(500).json({ error: 'Erro ao registrar visita' });
    }
  });

  // Get recent visits (Admin)
  app.get('/api/visits', (req: Request, res: Response) => {
    try {
      const visits = db.getVisits(100);
      res.json(visits);
    } catch (err: any) {
      console.error('Error getting visits:', err);
      res.status(500).json({ error: 'Erro ao carregar visitas' });
    }
  });

  // CRM: Get all leads
  app.get('/api/crm/leads', (req: Request, res: Response) => {
    try {
      const leads = db.getLeads();
      res.json(leads);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      res.status(500).json({ error: 'Erro ao carregar leads do CRM' });
    }
  });

  // CRM: Capture new lead (from announcement views, interest forms, WhatsApp button, etc.)
  app.post('/api/crm/leads', (req: Request, res: Response) => {
    try {
      const { name, email, phone, propertyId, source, notes, stage } = req.body;
      if (!name || (!email && !phone)) {
        return res.status(400).json({ error: 'Nome e pelo menos um contato (telefone ou e-mail) são obrigatórios' });
      }

      const newLead = db.createLead({
        name,
        email: email || 'contato@cliente.com',
        phone: phone || '(11) 99999-9999',
        propertyId,
        source: source || 'Formulário de Interesse',
        notes,
        stage: stage || 'novo'
      });

      res.status(201).json({ success: true, lead: newLead, message: 'Lead captado com sucesso no CRM!' });
    } catch (err: any) {
      console.error('Error creating lead:', err);
      res.status(500).json({ error: 'Erro ao captar lead no CRM' });
    }
  });

  // CRM: Update lead (e.g. Kanban stage drag-and-drop, notes, value)
  app.patch('/api/crm/leads/:id', (req: Request, res: Response) => {
    try {
      const updated = db.updateLead(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Lead não encontrado para atualização' });
      }
      res.json({ success: true, lead: updated });
    } catch (err: any) {
      console.error('Error updating lead:', err);
      res.status(500).json({ error: 'Erro ao atualizar lead' });
    }
  });

  // CRM: Delete lead
  app.delete('/api/crm/leads/:id', (req: Request, res: Response) => {
    try {
      const deleted = db.deleteLead(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Lead não encontrado para exclusão' });
      }
      res.json({ success: true, message: 'Lead removido com sucesso' });
    } catch (err: any) {
      console.error('Error deleting lead:', err);
      res.status(500).json({ error: 'Erro ao deletar lead' });
    }
  });

  // Analytics Dashboard
  app.get('/api/analytics', (req: Request, res: Response) => {
    try {
      const analytics = db.getAnalytics();
      res.json(analytics);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      res.status(500).json({ error: 'Erro ao gerar métricas do dashboard' });
    }
  });

  // Database status & schema
  app.get('/api/db/status', (req: Request, res: Response) => {
    try {
      const stats = db.getDatabaseStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao consultar status do banco de dados' });
    }
  });

  // Database reset to 6 seed properties
  app.post('/api/db/reset', (req: Request, res: Response) => {
    try {
      db.resetToSeed();
      res.json({ success: true, message: 'Banco de dados restaurado com os 6 anúncios de teste originais!' });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao resetar banco de dados' });
    }
  });

  // PostgreSQL Schema file delivery
  app.get('/api/schema.sql', (req: Request, res: Response) => {
    try {
      const schemaPath = path.join(process.cwd(), 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.sendFile(schemaPath);
      } else {
        res.status(404).send('schema.sql não encontrado');
      }
    } catch (err: any) {
      res.status(500).send('Erro ao ler schema.sql');
    }
  });

  // Seed Demo file delivery
  app.get('/api/seed_demo.sql', (req: Request, res: Response) => {
    try {
      const seedPath = path.join(process.cwd(), 'seed_demo.sql');
      if (fs.existsSync(seedPath)) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.sendFile(seedPath);
      } else {
        res.status(404).send('seed_demo.sql não encontrado');
      }
    } catch (err: any) {
      res.status(500).send('Erro ao ler seed_demo.sql');
    }
  });

  // --- VITE MIDDLEWARE (Dev) OR STATIC (Prod) ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RWimóveis Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting RWimóveis server:', err);
});
