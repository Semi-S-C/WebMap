const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');


const app = express();
const PORT = 8002;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));  // ✅ 这一行让浏览器能访问 device.csv

app.use(express.static(path.join(__dirname, 'public'))); // 让 public 目录里的文件可以直接访问
const CSV_FILE = './device.csv';

// 如果文件不存在，先写入表头
if (!fs.existsSync(CSV_FILE)) {
    const header = '大里程,小里程,观测点名称,设备ID,设备类型\n';
    fs.writeFileSync(CSV_FILE, header);
}

// 添加设备
app.post('/add-device', (req, res) => {
    const { 大里程, 小里程, 观测点名称, 设备ID, 设备类型 } = req.body;

    if (!大里程 || !小里程 || !观测点名称 || !设备ID || !设备类型) {
        return res.status(400).json({ error: '参数缺失' });
    }

    const csvWriter = createCsvWriter({
        path: CSV_FILE,
        header: [
            { id: '大里程', title: '大里程' },
            { id: '小里程', title: '小里程' },
            { id: '观测点名称', title: '观测点名称' },
            { id: '设备ID', title: '设备ID' },
            { id: '设备类型', title: '设备类型' },
        ],
        append: true
    });

    csvWriter.writeRecords([{ 大里程, 小里程, 观测点名称, 设备ID, 设备类型 }])
        .then(() => res.json({ message: '添加成功' }))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: '写入 CSV 失败' });
        });
});

app.listen(PORT, () => {
    console.log(`✅ 服务器运行在 http://localhost:${PORT}`);
});
