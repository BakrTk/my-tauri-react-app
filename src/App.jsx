import React, { useState } from "react";

// دالة لإنشاء مصفوفة من 30 منتج لكل قسم مع سعر يبدأ من قيمة أساسية
const generateProducts = (baseName, basePrice) =>
  Array.from({ length: 30 }, (_, i) => ({
    name: `${baseName} ${i + 1}`,
    price: `${basePrice + i} ريال`,
  }));

// دالة لإرجاع تدرج لوني يعتمد على اسم الفئة
const getCategoryGradient = (category) => {
  switch (category) {
    case "الكرزات":
      return "linear-gradient(135deg, #ff6b6b, #ff9a8b)";
    case "الحلويات":
      return "linear-gradient(135deg, #feca57, #ffde7d)";
    case "القهوة":
      return "linear-gradient(135deg, #1dd1a1, #a3e635)";
    case "الخضراوات":
      return "linear-gradient(135deg, #54a0ff, #74c0fc)";
    case "الفواكه":
      return "linear-gradient(135deg, #5f27cd, #845ef7)";
    case "المعجنات":
      return "linear-gradient(135deg, #ff9ff3, #feca57)";
    default:
      return "linear-gradient(135deg, #56ccf2, #2f80ed)";
  }
};

function App() {
  // الحالة لتحديد الصفحة الحالية (null: صفحة الداشبورد، وإلا اسم التصنيف)
  const [currentCategory, setCurrentCategory] = useState(null);
  // حالة مصطلح البحث في صفحة التفاصيل
  const [searchTerm, setSearchTerm] = useState("");

  // بيانات المنتجات لكل قسم (30 منتج لكل قسم)
  const categoryDetails = {
    الكرزات: generateProducts("قميص كرزات", 150),
    الحلويات: generateProducts("حلويات", 50),
    القهوة: generateProducts("قهوة", 30),
    الخضراوات: generateProducts("خضار", 10),
    الفواكه: generateProducts("فاكهة", 12),
    المعجنات: generateProducts("معجنات", 20),
  };

  // دالة الرجوع إلى صفحة الداشبورد
  const goBack = () => {
    setCurrentCategory(null);
    setSearchTerm("");
  };

  // صفحة الداشبورد (عرض البطاقات الخاصة بكل قسم)
  const renderDashboard = () => (
    <div className="cards-grid">
      {Object.keys(categoryDetails).map((category, index) => (
        <div
          key={index}
          className={`card card${index + 1}`}
          onClick={() => setCurrentCategory(category)}
          style={{ cursor: "pointer", animationDelay: `${index * 0.1}s` }}
        >
          <h2>{category}</h2>
        </div>
      ))}
    </div>
  );

  // صفحة التفاصيل لكل قسم مع إمكانية البحث وعرض المنتجات 4 في صف
  const renderDetailPage = () => {
    // تصفية المنتجات بناءً على مصطلح البحث
    const products = categoryDetails[currentCategory].filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
      <div className="detail-page">
        <button className="back-btn" onClick={goBack}>
          &larr; رجوع
        </button>
        <h2>{currentCategory}</h2>
        <input
          type="text"
          className="search-input"
          placeholder="ابحث عن منتج..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="products-grid">
          {products.map((item, idx) => (
            <div
              key={idx}
              className="product-item"
              style={{
                background: getCategoryGradient(currentCategory),
                animationDelay: `${idx * 0.05}s`,
              }}
            >
              <span className="item-name">{item.name}</span>
              <span className="item-price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* يظهر العنوان فقط في صفحة الداشبورد */}
      {!currentCategory && (
        <header className="top-header">
          <h1>لوحة التحكم الفاخرة</h1>
        </header>
      )}
      {currentCategory ? renderDetailPage() : renderDashboard()}

      <style>{`
        /* إعادة تعيين الإعدادات الأساسية */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #0f2027;
          overflow: hidden;
        }
        /* تحديد أبعاد الشاشة الثابتة 800×480 ومحاذاة المحتوى في المنتصف */
        .app-container {
          width: 800px;
          height: 480px;
          margin: auto;
          padding: 1rem;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        /* العنوان الرئيسي يظهر فقط في الداشبورد */
        .top-header {
          text-align: center;
          margin-bottom: 1rem;
          color: #fff;
          animation: fadeInDown 0.8s ease;
          width: 100%;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .top-header h1 {
          font-size: 2rem;
          letter-spacing: 2px;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
        }
        /* شبكة البطاقات في الداشبورد: 3 أعمدة */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          width: 100%;
          animation: fadeIn 0.8s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        /* تصميم البطاقات مع تأثير الزجاج واللمعان */
        .card {
          position: relative;
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          padding: 1rem;
          color: #fff;
          backdrop-filter: blur(10px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.4);
          transition: transform 0.3s, box-shadow 0.3s;
          overflow: hidden;
          animation: cardEntrance 0.5s ease forwards;
          opacity: 0;
        }
        @keyframes cardEntrance {
          to { opacity: 1; }
        }
        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 32px rgba(0,0,0,0.6);
        }
        .card::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(60deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: rotate(25deg);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(25deg); }
          50% { transform: translateX(100%) rotate(25deg); }
          100% { transform: translateX(-100%) rotate(25deg); }
        }
        .card h2 {
          font-size: 1.4rem;
          margin-bottom: 0.8rem;
          position: relative;
          z-index: 1;
          text-shadow: 2px 2px 6px rgba(0,0,0,0.6);
        }
        /* ألوان وتدرجات فريدة لكل بطاقة */
        .card1 {
          border-left: 6px solid #ff6b6b;
          background: linear-gradient(135deg, #ff6b6b, #ff9a8b);
        }
        .card2 {
          border-left: 6px solid #feca57;
          background: linear-gradient(135deg, #feca57, #ffde7d);
        }
        .card3 {
          border-left: 6px solid #1dd1a1;
          background: linear-gradient(135deg, #1dd1a1, #a3e635);
        }
        .card4 {
          border-left: 6px solid #54a0ff;
          background: linear-gradient(135deg, #54a0ff, #74c0fc);
        }
        .card5 {
          border-left: 6px solid #5f27cd;
          background: linear-gradient(135deg, #5f27cd, #845ef7);
        }
        .card6 {
          border-left: 6px solid #ff9ff3;
          background: linear-gradient(135deg, #ff9ff3, #feca57);
        }
        /* صفحة التفاصيل: تمتد لتشغل كامل الشاشة داخل الحاوية */
        .detail-page {
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.15);
          border-radius: 15px;
          padding: 0.8rem;
          color: #fff;
          backdrop-filter: blur(10px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.4);
          animation: fadeIn 0.5s ease;
          overflow-y: auto;
        }
        .back-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          transition: background 0.3s, transform 0.3s;
        }
        .back-btn:hover {
          background: rgba(255,255,255,0.35);
          transform: scale(1.05);
        }
        .detail-page h2 {
          margin-bottom: 1rem;
          font-size: 2rem;
          text-align: center;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
        }
        /* حقل البحث */
        .search-input {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 0.8rem;
          border: none;
          border-radius: 8px;
          outline: none;
        }
        /* شبكة المنتجات: 4 أعمدة */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }
        /* تخصيص ألوان المنتجات بناءً على الفئة */
        .product-item {
          padding: 0.5rem;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          transition: transform 0.3s;
          animation: itemFadeIn 0.5s ease forwards;
          opacity: 0;
        }
        @keyframes itemFadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .product-item:hover {
          transform: translateY(-3px);
        }
        .item-name {
          font-size: 0.9rem;
          display: block;
          margin-bottom: 0.2rem;
        }
        .item-price {
          font-size: 0.9rem;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

export default App;
