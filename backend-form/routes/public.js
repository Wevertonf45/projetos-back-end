//Imporações de bibliotecas
import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


//Variáveis de configurações
const router = express.Router()
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET


//Rota para cadastrar
router.post('/cadastro', async (req, res) => {
    try {
        //Salvar a requisição do body
        const { name, email, password } = req.body


        //Verificar se os dados estão corretos
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Preencha todos os campos!' })
        }

        //Criptografar a senha
        const hashPassword = await bcrypt.hash(password, 10)

        //Acessar o banco de dados
        const user = await prisma.user.create({
            data: { name, email, password: hashPassword }
        })

        //Resposta
        return res.status(201).json({ message: 'Usuário criado com sucesso!', user })

    } catch (err) {
        //Verificar duplicadas
        if (err.code === 'P2002') {
            return res.status(400).json({ message: 'Email já cadastrado!' })
        }
        return res.status(500).json({ message: 'Erro no servidor!' })
    }
})


//Rota para fazer login
router.post('/login', async (req, res) => {
    try {
        //Salvar a requisição do body
        const { email, password } = req.body

        //Acessar o banco de dados
        const userInf = await prisma.user.findUnique({
            where: { email }
        })

        //Verificar o usuário
        if (!userInf) {
            return res.status(404).json({ message: 'Usuário não cadastrado!' })
        }

        //Verificar a senha
        const userPassword = await bcrypt.compare(password, userInf.password)
        if (!userPassword) {
            return res.status(404).json({ message: 'Verifique a senha!' })
        }

        const token = jwt.sign({ id: userInf.id }, JWT_SECRET, { expiresIn: '1h' })

        //Resposta
        return res.status(200).json({ message: 'Login efetuado com sucesso!', token })

    } catch (err) {
        return res.status(500).json({ message: 'Erro no servidor!' })
    }
})

export default router