Write-Host "正在初始化 Git 仓库..."
git init

Write-Host "添加文件 (这可能需要几秒钟)..."
git add .

Write-Host "提交代码..."
git commit -m "Initial commit: GlobalBiz Calendar Project"

Write-Host "重命名主分支为 main..."
git branch -M main

Write-Host "设置远程仓库..."
try {
    git remote remove origin 2>$null
} catch {}
git remote add origin https://github.com/xinlingx0717-svg/ceshi.git

Write-Host "正在推送到 GitHub (可能需要登录)..."
git push -u origin main

Write-Host "操作完成！"
Read-Host "按回车键退出..."
