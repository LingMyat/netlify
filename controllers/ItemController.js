const { z } = require("zod");
const prisma = require("../utils/prismaClient");

const itemSchema = z.object({
    projectId: z.number().int().nonnegative(),
    link: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    image: z.string(),
})

exports.create = async (req, res) => {
    const request = {
        ...req.body,
        projectId: Number(req.body.projectId),
        image    : req.file.filename
    };

    const validation = itemSchema.safeParse(request);

    if (!validation.success) {
        const err = {
            errors: validation.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Login.',
        };

        res.status(400).json(err);
    } 

    try {
        const { data } = validation;

        const item = await prisma.item.create({ data });

        res.json(item);
    } catch (e) {
        res.status(500).json({ error: e });
    }
    
}

exports.get = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await prisma.item.findFirst({
            where: { id: Number(id) }
        });

        res.json(item);
    } catch (e) {
        res.status(500).json({ error: e });
    }
}

exports.update = async (req, res) => {
    const { id } = req.params;

    const request = {
        ...req.body,
        projectId: Number(req.body.projectId),
        image    : req.file.filename
    };

    const validation = itemSchema.safeParse(request);

    if (!validation.success) {
        const err = {
            errors: validation.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Login.',
        };

        res.status(400).json(err);
    } 

    try {
        const { data } = validation;

        const item = await prisma.item.update({
            where: { id: Number(id) },
            data
        });

        res.json(item);
    } catch (e) {
        res.status(500).json({ error: e });
    }
}

exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.item.delete({
            where: { id: Number(id) }
        });

        res.sendStatus(204);
    } catch (e) {
        res.status(500).json({ error: e });
    }
}