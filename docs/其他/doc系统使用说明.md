###Doc系统使用说明
#####首次使用
1.	安装nodejs，参考node官网教程[下载](https://nodejs.org/download/)并安装。
2.	安装grunt-cli。
	
	```
		npm install grunt-cli -g
	```
	
3.	将[git仓库](https://git.hz.netease.com/hzliwei/webdoc)clone到本地。
4.	执行watch.sh(windows下用watch.bat)脚本，此时会在本地开启一个server，并在浏览器中打开预览页面。watcher会监听本地文件的变化，发现文件修改后会自动编译，因此可以实时在浏览器中预览效果。

#####编写文档

1.	文档采用markdown语法编写，请首先熟悉下markdown语法。
2.	所有的文档都放在docs目录下，你可以根据自己的需求增改目录或文件。
3.	order.json用于指定该目录下文件的顺序，不指定则为默认顺序。
4.	文档中需要用到的图片资源或文件资源请对应放到pictures目录和files目录。可以用下面的方式引用对应资源。

	```
	![图片](pictures/demo.png)
	[文件下载](files/demo.png)
	```

5.	写完文档后记得push到git，服务器会定时更新。 