const { z } = require("zod");
const util   = require('../utils/index');
const prisma = require("../utils/prismaClient");

const itemSchema = z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    slogan: z.string(),
});

exports.index = async (req, res) => {
    try {
        const data = await prisma.project.findMany({
            include: {
                skills: { 
                    include: { skill: true }
                },
            },
            orderBy:{id: 'asc'}
        });

        const result = data.map((project) => {
            const skills = project.skills.map(skill => skill.skill);

            return { 
                ...project, 
                skills 
            }
        });

        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e });
    }
}

exports.show = async (req, res) => {
    const { slug } = req.params;

    try {
        const data = await prisma.project.findFirst({
            where  : { slug },
            include: {
                items : {
                    orderBy:{id: 'asc'}
                },
                skills: { 
                    include: { skill: true }
                },
            }
        });

        if(data) {
            
            res.json({
                ...data,
                skills: data.skills.map(skill => skill.skill)
            });

        } else {
            res.status(404).json(null);
        }
        

    } catch (e) {
        res.status(500).json({ error: e });
    }
}

exports.update = async (req, res) => {
    const { id } = req.params;

    const request = {
        ...req.body,
        slug: util.slugify(req.body.name) 
    }

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

        const item = await prisma.project.update({
            where: { id: Number(id) },
            data
        });

        res.json(item);

    } catch (e) {
        res.status(500).json({ error: e });
    }
}