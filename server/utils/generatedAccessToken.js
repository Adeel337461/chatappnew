import jwt from 'jsonwebtoken'

const generatedAccessToken = async(userId)=>{
    const token = await jwt.sign({ id : userId},
        process.env.JWT_SECREAT_KEY,
        { expiresIn : '24h'}
    )

    return token
}

export default generatedAccessToken