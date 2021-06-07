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

เป็นส่วนที่แสดงผลในรูปแบบของ Heatmap โดยสามารถดูได้ทั้งอุณหภูมิและความชื้น อีกทั้งยังสามารถดูประวัติย้อนหลังได้ด้วย ซึ่งแต่สีจะบ่งบอกอุณหภูมิที่แตกต่างกันจะเป็นดังรูปที่ 3-28 และรูปที่ 3-29โดยสีวรรณะร้อน (Warm Tone)  จะแทนบริเวณที่มีอุณหภูมิสูง และสีวรรณะเย็น (Cold Tone) จะแทนกลุ่มของพฤติกรรมข้อมูล ที่มีอุณหภูมิต่ำ ส่วนความชื้นจะแสดงเป็นสีเขียว จะแทนบริเวณที่มีความชื้น 55 % - 65 % ซึ่งเป็นความชื้นที่เหมาะในห้องศูนย์ข้อมูล แต่ถ้าหากค่าความชื้นต่ำกว่าหรือมากกว่า 55 % - 65 % จะแสดงเป็นสีเหลืองและแดงตามลำดับ

![](/asset/7.png )

- Charts section-1

![](/asset/8.png )

- Charts section-2

![](/asset/9.png )

- Charts section-3

![](/asset/10.png )

- History section-1

![](/asset/11.png )


- History section-2

![](/asset/12.png )


- Alert section

![](/asset/13.png )

- Config section

![](/asset/14.png )


- Profile Setting section

![](/asset/15.png )
