Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("D:\cloud project\mobile\assets\icon_src.jpg")
$img.Save("D:\cloud project\mobile\assets\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()

$img2 = [System.Drawing.Image]::FromFile("D:\cloud project\mobile\assets\icon_src.jpg")
$img2.Save("D:\cloud project\mobile\assets\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img2.Dispose()

$img3 = [System.Drawing.Image]::FromFile("D:\cloud project\mobile\assets\icon_src.jpg")
$img3.Save("D:\cloud project\mobile\assets\splash.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img3.Dispose()
