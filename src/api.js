const express = require("express");
const Serverless = require('serverless-http');

const app = express();

const { PrismaClient } = require('@prisma/client');
const prisma   = new PrismaClient();

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.static('public'));

const router = express.Router();

router.get('/', (req,res) => {
    res.json("Working on progress");
})

router.get('/projects', async(req, res) => {
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
})

router.get('/:slug', async(req, res) => {
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
})

app.use('/.netlify/functions/api',router);

module.exports.handler = Serverless(app);