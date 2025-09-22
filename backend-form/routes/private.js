import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/listar', async (req, res) => {
    try {
        const users = await prisma.user.findMany()
        return res.status(200).json(users)

    } catch (err) {
        return res.status(500).json({ message: 'Erro no servidor' })
    }
})

export default router