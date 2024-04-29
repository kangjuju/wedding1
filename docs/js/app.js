const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// MongoDB 연결
mongoose.connect('YOUR_MONGODB_CONNECTION_STRING', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB에 연결되었습니다.");
}).catch(err => {
    console.error("MongoDB 연결 오류:", err);
    process.exit();
});

// 모델 정의
const GuestbookEntry = mongoose.model('GuestbookEntry', {
    name: String,
    email: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// 미들웨어 설정
app.use(bodyParser.json());

// API 엔드포인트
app.post('/guestbook', async (req, res) => {
    const { name, email, message } = req.body;
    const entry = new GuestbookEntry({ name, email, message });

    try {
        await entry.save();
        res.status(201).send("방명록이 작성되었습니다.");
    } catch (err) {
        console.error("방명록 저장 오류:", err);
        res.status(500).send("서버 오류로 방명록을 작성할 수 없습니다.");
    }
});

app.get('/guestbook', async (req, res) => {
    try {
        const entries = await GuestbookEntry.find().sort({ createdAt: -1 });
        res.json(entries);
    } catch (err) {
        console.error("방명록 가져오기 오류:", err);
        res.status(500).send("서버 오류로 방명록을 가져올 수 없습니다.");
    }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
