export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请选择要上传的文件' })
    }

    // 构建可访问的URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${
      req.file.filename
    }`

    res.status(200).json({
      message: '文件上传成功',
      url: imageUrl,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('文件上传错误:', error)
    res.status(500).json({ message: '文件上传失败' })
  }
}
