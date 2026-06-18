// ===== 行程資料 Trip Data =====

const TRIP_DAYS = [
{
id: 1,
date: “6/19”,
weekday: “五”,
route: “民宿 ➔ 換錢 ➔ 明洞 ➔ 民宿 ➔ 弘大”,
items: [
{ type: “transport”, time: “06:00”, title: “機場集合”, desc: “抵達首爾先前往民宿寄放行李” },
{ type: “note”, time: “13:30”, title: “明洞商圈”, desc: “” },
{ type: “shop”, title: “明洞換錢 — Money Planet”, desc: “”, link: “https://naver.me/5wrXwDyN” },
{ type: “food”, title: “午餐：利庭園燒肉”, desc: “招牌 ★ 3000刀功五花肉”, link: “https://naver.me/GUTWS5S2” },
{ type: “shop”, title: “OY明洞”, desc: “”, link: “https://naver.me/59lOopsn” },
{ type: “food”, title: “明朗熱狗”, desc: “”, link: “https://naver.me/GYDVq6bh” },
{ type: “food”, title: “龍鬚糖小哥”, desc: “營業時間 17:00–23:00”, link: “https://naver.me/xaTZpzBL” },
{ type: “note”, title: “回民宿放戰利品”, desc: “順便補個妝、換個辣妹妝 💄” },
{ type: “note”, title: “弘大”, desc: “” },
{ type: “food”, time: “21:00”, title: “正宗弘大李太祖脊骨土豆湯”, desc: “이대조뼈다귀 · 22:30最後點餐”, link: “https://naver.me/FWT34lrn” },
{ type: “note”, title: “弘大逛逛”, desc: “” },
{ type: “content”, title: “📹 拍攝美食轉場素材”, desc: “明洞 / 弘大美食店家，記得拍轉場片段” }
]
},
{
id: 2,
date: “6/20”,
weekday: “六”,
route: “漢南洞 ➔ 民宿 ➔ 聖水洞”,
items: [
{ type: “note”, title: “睡到飽”, desc: “13:00左右可以出門逛逛” },
{ type: “food”, title: “午餐 OASIS”, desc: “”, link: “https://naver.me/GUTWepjK” },
{ type: “note”, title: “吃飽逛街！”, desc: “漢南洞商圈” },
{ type: “transport”, time: “16:00”, title: “回民宿迎接”, desc: “迎接後出發聖水洞” },
{ type: “note”, title: “先去候位烤黨，若無位改吃一隻雞”, desc: “” },
{ type: “food”, title: “烤黨 꿈당”, desc: “🍖 只能現場候位”, link: “https://naver.me/FfsvuMGF” },
{ type: “food”, title: “本家一隻雞”, desc: “🍲”, link: “https://naver.me/5RAPBc8p” }
]
},
{
id: 3,
date: “6/21”,
weekday: “日”,
route: “化妝室 ➔ 狎鷗亭 ➔ 民宿 ➔ 醬蟹 ➔ 新堂洞雞爪 ➔ 東大門”,
items: [
{ type: “note”, time: “10:00”, title: “蕾 / 金老師”, desc: “化妝室”, link: “https://naver.me/xaTUQJQn” },
{ type: “note”, title: “狎鷗亭｜午餐＋逛街”, desc: “” },
{ type: “food”, title: “London Bagel 倫敦貝果 🥯”, desc: “”, link: “https://naver.me/GO6daPpz” },
{ type: “food”, title: “Kurarie 漂亮咖啡廳”, desc: “”, link: “https://naver.me/xgXZvNV5” },
{ type: “note”, title: “中間可回民宿”, desc: “稍作休息” },
{ type: “food”, title: “烏達里家 🦀 醬蟹”, desc: “”, link: “https://naver.me/FP8hVUm6” },
{ type: “note”, title: “東大門”, desc: “夜間逛街” }
]
},
{
id: 4,
date: “6/22”,
weekday: “一”,
route: “分頭行動 ➔ 南大門 ➔ 蒜味辣雞湯 ➔ 梨泰院/江南”,
items: [
{ type: “note”, time: “11:00”, title: “大小張｜Rappoel醫美”, desc: “”, link: “https://naver.me/5FDI4hdB” },
{ type: “food”, title: “午餐：庭+妍｜新沙宋慧喬牛腸”, desc: “”, link: “https://naver.me/xHEXJDES” },
{ type: “food”, title: “午餐：大小張｜鐘路 Gyerim 辣燒雞湯”, desc: “계림”, link: “https://naver.me/5wruxrl1” },
{ type: “shop”, title: “樂天免稅店”, desc: “”, link: “https://naver.me/GahUK8mS” },
{ type: “shop”, title: “南大門｜批發＋小吃”, desc: “”, link: “https://naver.me/5Ol8StBv” },
{ type: “shop”, title: “廣藏市場｜棉被＋小吃”, desc: “”, link: “https://naver.me/F3EkxAMR” },
{ type: “food”, title: “將軍餐館｜牡蠣菜包飯＋白切豬”, desc: “”, link: “https://naver.me/xVRLOFyt” },
{ type: “content”, title: “📹 拍攝超商素材”, desc: “梨泰院 / 江南超商，咖啡或茶、酒類都拍” },
{ type: “content”, title: “📹 拍攝 Seoul Vlog 素材”, desc: “街景、夜生活氛圍空景” }
]
},
{
id: 5,
date: “6/23”,
weekday: “二”,
route: “新堂洞 ➔ 機場”,
items: [
{ type: “food”, title: “友情雞爪 우정닭발”, desc: “新堂洞”, link: “https://naver.me/574xDVIG” },
{ type: “transport”, time: “16:00–16:30”, title: “出發前往機場”, desc: “BR159 ✈️” }
]
}
];

const COMMON_INFO = {
accommodation: {
address: “首尔特别市 龙山区 梨泰院洞 375-1”,
link: “https://naver.me/56XFV1Si”
},
flights: [
{ date: “6/19（五）”, flight: “BR170”, note: “約 06:00 機場碰面” },
{ date: “6/23（二）”, flight: “BR159”, note: “16:30 準備前往機場” }
]
};

const PREP_CHECKLIST = [
{ category: “電子產品”, items: [
{ text: “esim ｜5天吃到飽（蕾の連結）”, sub: “https://esimconnect.com.tw”, link: “https://esimconnect.com.tw/?fbclid=PARlRTSASgMx9leHRuA2FlbQIxMABzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAafJiMeyRu4nj_WUbhw9-lVJhk_SgoJhyAe-O3f77GtXQ8Ph5efEbDarnPiqNQ_aem_RZSLYVJsLIsPxH429XtzXg#/access/esimbuy?region=%E9%9F%93%E5%9C%8B&referencecode=leona” },
{ text: “韓國電壓為220V，台灣電器需自備轉接頭”, sub: “圓孔轉接頭 / 萬國轉接頭” },
{ text: “行動電源（記得隨身攜帶，不可放託運行李）” },
{ text: “各裝置充電線、相機記憶卡” }
]},
{ category: “證件 / 申請”, items: [
{ text: “e-Arrival 電子入境卡”, sub: “出發前72小時內填寫”, link: “https://www.k-eta.go.kr/” },
{ text: “Check in Seoul｜首爾旅遊優惠卡”, sub: “可享景點 / 美食優惠”, link: “” },
{ text: “護照（效期需大於6個月）” }
]},
{ category: “金融 / 預算”, items: [
{ text: “台幣現金（明洞換錢用）” },
{ text: “信用卡（海外刷卡回饋款）” },
{ text: “Wowpass 或 T-money 交通卡” }
]},
{ category: “衣物 / 個人用品”, items: [
{ text: “雨具（折傘 / 輕便雨衣）”, sub: “6月首爾為梅雨季，務必準備” },
{ text: “防曬乳、太陽眼鏡” },
{ text: “個人藥品（腸胃藥、止痛藥、感冒藥）” },
{ text: “保養品、化妝品（小瓶分裝）” },
{ text: “舒適好走的鞋（逛街路線多）” },
{ text: “夜店戰袍 / 拍照戰袍 ✨” }
]},
{ category: “其他”, items: [
{ text: “空行李箱空間（戰利品預留）” },
{ text: “環保購物袋（市場 / 免稅店戰利品）” },
{ text: “韓文菜單翻譯 App 先下載” }
]}
];

const NIGHTLIFE = [
{
area: “梨泰院”,
name: “Privilege Bar”,
desc: “適合漂亮小酌、拍照、開場”,
link: “https://naver.me/F4W5riSe”
},
{
area: “梨泰院”,
name: “Southside Parlor”,
desc: “比較外國人友善、酒＋食物，適合先暖場”,
link: “https://naver.me/xWIJpN1Q”
},
{
area: “清潭洞”,
name: “People The Terrace”,
desc: “酒吧、idol明星愛店、店員帥，客人素質高、食物不錯”,
link: “https://naver.me/F05Zt75F”
},
{
area: “江南”,
name: “DM Seoul”,
desc: “KPOP / HIPHOP / 歐美風音樂，週五人多帥哥多”,
link: “https://naver.me/FfsvAYfh”
},
{
area: “江南”,
name: “Color Apgu”,
desc: “（DM對面）音樂風格多變，DJ水平很高，常有當地知名Rapper表演”,
link: “https://naver.me/IFErIq20”
}
];

const EXCHANGE_RATE = 46.7; // 1 TWD = 46.7 KRW（韓鍰/台幣）

// 首爾 6 月下旬氣候參考值（歷年同期平均，非即時預報）
const SEOUL_CLIMATE_REFERENCE = [
{ label: “6/19”, icon: “🌤️”, desc: “大致晴朗”, high: 28, low: 19, rainChance: 30 },
{ label: “6/20”, icon: “⛅”, desc: “局部多雲”, high: 27, low: 19, rainChance: 35 },
{ label: “6/21”, icon: “🌦️”, desc: “雲多有雨”, high: 27, low: 20, rainChance: 45 },
{ label: “6/22”, icon: “🌦️”, desc: “雲多有雨”, high: 26, low: 20, rainChance: 50 },
{ label: “6/23”, icon: “🌧️”, desc: “梅雨季陣雨”, high: 26, low: 20, rainChance: 55 }
];

const EXPENSE_CATEGORIES = [“美食”, “購物”, “交通”, “住宿”, “娛樂”, “醫美”, “其他”];

const CONTENT_TASKS = [
{
icon: “🍴”,
title: “美食轉場”,
desc: “每間美食店家拍攝開場／轉場素材（招牌、開吃瞬間、招牌菜特寫）”,
items: [
{ text: “Day1 利庭園燒肉” },
{ text: “Day1 明朗熱狗” },
{ text: “Day1 龍鬚糖小哥” },
{ text: “Day1 弘大李太祖脊骨土豆湯” },
{ text: “Day2 OASIS” },
{ text: “Day2 烤黨 / 一隻雞” },
{ text: “Day3 London Bagel” },
{ text: “Day3 Kurarie咖啡廳” },
{ text: “Day3 烏達里家醬蟹” },
{ text: “Day4 牛腸 / 辣燒雞湯” },
{ text: “Day4 將軍餐館” },
{ text: “Day5 友情雞爪” }
]
},
{
icon: “🏪”,
title: “超商（咖啡/茶－酒）”,
desc: “超商買咖啡、茶飲、酒類，拍開瓶／開罐＋乾杯片段”,
items: [
{ text: “超商咖啡開場” },
{ text: “超商茶飲開場” },
{ text: “超商啤酒/燒酒乾杯” },
{ text: “超商小吃搭配畫面” }
]
},
{
icon: “🎬”,
title: “Seoul Vlog”,
desc: “城市空景、移動畫面、生活片段，用於 vlog 剪輯素材”,
items: [
{ text: “機場抵達畫面” },
{ text: “民宿環境 / 開箱” },
{ text: “明洞街景” },
{ text: “弘大街景” },
{ text: “聖水洞街景” },
{ text: “狎鷗亭街景” },
{ text: “東大門夜景” },
{ text: “梨泰院 / 江南夜生活氛圍空景” },
{ text: “南大門 / 廣藏市場逛街畫面” },
{ text: “機場離境畫面” }
]
}
];
