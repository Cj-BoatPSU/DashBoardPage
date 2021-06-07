# Data center environment monitoring and managements
<p> โครงงานนี้เป็นการพัฒนาระบบตรวจสอบและเฝ้าระวังสภาพแวดล้อมภายในศูนย์ข้อมูล (Data Center) เพื่อตรวจสอบและเฝ้าระวังอุณหภูมิและความชื้นภายในศูนย์ข้อมูล โดยการใช้เซนเซอร์ที่ต่อกับราสเบอร์รี่พาย และใช้ภาษาไพธอนในการอ่านค่าที่ได้จากเซนเซอร์ จากนั้นจึงนำข้อมูลที่ได้มาแสดงผลผ่านเว็บไซต์ในรูปแบบของฮีทแมพ (heatmap) โดยข้อมูลดังกล่าวสามารถดูย้อนหลังได้ ช่วยให้ผู้ดูแลระบบสามารถรับรู้เหตุการณ์ภายในห้องศูนย์ข้อมูลเมื่ออุณหภูมิหรือความชื้นมีค่าที่สูงกว่าเกณฑ์ที่กำหนด (Thresholds) ผ่านการแจ้งเตือนทาง email และ Line notification </p>
<p> ผลจากการดำเนินงานพบว่า สามารถแสดงข้อมูลอุณหภูมิและความชื้นให้อยู่ในรูปแบบ heatmap และข้อมูลดังกล่าวสามารถดูย้อนหลังได้ สามารถแจ้งเตือนเมื่อมีค่าเกินกว่าที่กำหนดผ่านช่องทาง email และ Line notification ได้ </p>

## ภาพรวมของระบบ
![](/asset/1.png)
## Sequence diagram overview system
![](/asset/2.png)
## Web UI design

- Login Page

![](/asset/3.png )

- Heatmap section-1 (temperature type)

![](/asset/4.png )

- Heatmap section-2 (temperature type)

![](/asset/5.png )

- Heatmap section-3 (humidity type)

![](/asset/6.png )

- Heatmap section-4 (humidity type)

![](/asset/7.png )
