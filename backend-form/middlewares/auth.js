import jwv from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ message: 'Não autorizado' })
    }

    try {
        const decoded = jwv.verify(token.replace('Bearer', '').trim(), JWT_SECRET)
        req.user = decoded

        next()

    } catch (err) {
        return res.status(401).json({ message: 'Não autorizado!' })
    }
}

export default auth