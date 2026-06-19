const editor = document.getElementById('editor')
const preview = document.getElementById('preview')

function render() {
  const md = editor.value
  const html = marked.parse(md, { gfm: true, breaks: true })
  preview.innerHTML = html
}

function downloadHtml() {
  const content = preview.innerHTML
  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Markdown Preview</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown-light.css">
<style>
.markdown-body{box-sizing:border-box;min-width:200px;max-width:980px;margin:0 auto;padding:20px;}
</style>
</head>
<body class="markdown-body">
${content}
</body>
</html>`
  const blob = new Blob([fullHtml], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'github-preview.html'
  a.click()
  URL.revokeObjectURL(url)
}

function copyHtml() {
  navigator.clipboard.writeText(preview.innerHTML).then(() => alert('已复制 HTML'))
}

function clearAll() {
  editor.value = ''
  preview.innerHTML = ''
}

async function downloadMergedMsi() {
  const totalParts = 7
  const btn = document.getElementById('download-msi-btn')
  const originalText = btn ? btn.textContent : '下载安装程序（.msi）'

  if (btn) {
    btn.textContent = '正在下载 0/' + totalParts + '...'
    btn.disabled = true
  }

  try {
    const blobs = []
    for (let i = 0; i < totalParts; i++) {
      const url = `parts/mhsetup.msi.part${String(i).padStart(3, '0')}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('下载分块 ' + (i + 1) + ' 失败')
      const blob = await response.blob()
      blobs.push(blob)
      if (btn) btn.textContent = `正在下载 ${i + 1}/${totalParts}...`
    }

    const mergedBlob = new Blob(blobs, { type: 'application/x-msi' })
    const downloadUrl = URL.createObjectURL(mergedBlob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = 'mhsetup.msi'
    a.click()
    URL.revokeObjectURL(downloadUrl)

    if (btn) btn.textContent = '下载完成'
    setTimeout(() => {
      if (btn) {
        btn.textContent = originalText
        btn.disabled = false
      }
    }, 2000)
  } catch (err) {
    alert('下载失败: ' + err.message)
    if (btn) {
      btn.textContent = originalText
      btn.disabled = false
    }
  }
}

function downloadExe() {
  const a = document.createElement('a')
  a.href = 'mhsetup.exe'
  a.download = 'mhsetup.exe'
  a.click()
}

function downloadOldExe() {
  const a = document.createElement('a')
  a.href = 'mhsetup-old.exe'
  a.download = 'mhsetup-old.exe'
  a.click()
}

editor.addEventListener('input', render)
render()
