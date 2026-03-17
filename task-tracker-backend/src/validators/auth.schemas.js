const { z } = require('zod');

const registerBody = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
  name: z.string().min(1).max(120).optional(),
});

const loginBody = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(200),
});

module.exports = { registerBody, loginBody };

