import express from 'express'
import upload from '../config/upload.js'
import { uploadImage } from '../controllers/uploadController.js'

const router = express.Router()

// 单文件上传接口
router.post('/image', upload.single('image'), uploadImage)

export default router
