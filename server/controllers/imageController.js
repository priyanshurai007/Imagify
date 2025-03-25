import axios from "axios"
import userModel from "../models/userModel.js"
import FormData from "form-data"


export const generateImage = async (req, res) => {
    try{
        
        const {userId, prompt} = req.body
        const user = await userModel.findById(userId)

        if(!user || !prompt){
            return res.status(404).json({success: false, message:"missing details"})
        }

        if(user.creditBalance === 0 || userModel.creditBalance < 0){ 
            return res.status(400).json({success: false, message:"Insufficient credits", creditBalance: user.creditBalance})
        }

        const formData = new FormData()

        formData.append("prompt", prompt)

        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1',formData,{  headers: {
            'x-api-key': 'df11bc0748ea5150342460e123cb13790eb6af013e886a0a485a6a164e4bc9454fe20a28cc02fc1821b910fdc19e3af9',
          }, responseType: 'arraybuffer'})

          const base64Image = Buffer.from(data, 'binary').toString('base64')
          const resultImage = `data:image/png;base64,${base64Image}`

          await userModel.findByIdAndUpdate(user._id, {creditBalance: user.creditBalance - 1})
          res.json({success: true, message: "Image Generated", creditBalance: user.creditBalance - 1, resultImage})

    } catch(error){
        (error)
        res.status(500).json({success: false, message: error.message})
    }
}
