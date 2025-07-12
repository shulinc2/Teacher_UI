let selectedBooks = [];
let currentMode = 'definition';
let flashcards = []; // This will now store the structured JSON flashcards
let currentCardIndex = 0;
let correctAnswers = 0;
let totalCards = 0;

// Multi-language text configuration
const translations = {
  'zh': {
    pageTitle: '闪卡生成器',
    pageSubtitle: '创建具有多种学习模式的交互式闪卡',
    selectMode: '🎮 选择闪卡模式',
    definitionMode: '定义模式',
    definitionDesc: '正面显示术语，背面显示定义。适合词汇和概念学习。',
    translationMode: '翻译模式',
    translationDesc: '正面显示一种语言的单词，背面显示翻译。',
    multipleChoiceMode: '多选题模式',
    multipleChoiceDesc: '正面显示问题和选项，背面显示正确答案。',
    fillBlankMode: '填空题模式',
    fillBlankDesc: '正面显示不完整的句子，背面显示缺失的单词。',
    imageBasedMode: '图片模式',
    imageBasedDesc: '正面显示图片，背面显示描述或名称。',
    contentSource: '📄 内容来源',
    uploadMaterials: '上传材料 (PDF/DOC/TXT)',
    dragDropFiles: '📁 拖拽文件到此处或点击浏览',
    useDatabase: '使用预加载数据库 (HK/CN)',
    typeManually: '手动输入内容',
    enterContent: '在此输入您的内容...',
    uploadImages: '上传图片用于图片模式',
    dragDropImages: '🖼️ 拖拽图片文件到此处或点击浏览',
    parameters: '⚙️ 参数设置',
    duration: '时长:',
    durationPlaceholder: '例如: 45分钟',
    grade: '年级:',
    gradePlaceholder: '例如: 三年级',
    difficulty: '难度:',
    high: '高',
    mid: '中',
    low: '低',
    topic: '主题:',
    topicPlaceholder: '输入主题...',
    translationSettings: '翻译设置:',
    fromLanguage: '起始语言:',
    toLanguage: '目标语言:',
    cardCount: '闪卡数量:',
    generateCards: '✨ 生成闪卡',
    clickToStart: '点击开始',
    backContent: '背面内容',
    previous: '← 上一张',
    next: '下一张 →',
    correct: '✅ 正确',
    incorrect: '❌ 错误',
    shuffle: '🔀 打乱',
    startStudy: '🧑‍🏫 开始教学模式',
    exportOptions: '📤 导出选项',
    exportWord: '导出为Word',
    exportPPT: '导出为PPT',
    exportCSV: '导出为CSV',
    exportJSON: '导出为JSON',
    generatedCards: '📄 生成的闪卡',
    clickToFlip: '💡 点击任意卡片翻转查看答案。使用下方按钮开始交互式学习模式或导出。',
    flipAll: '🔄 翻转所有卡片',
    resetAll: '🔄 重置所有卡片',
    selectedBooks: '已选书籍:',
    noCardsAvailable: '没有可用的闪卡。请先生成内容。',
    generatingCards: '正在生成闪卡...',
    noCardsGenerated: '❌ 没有生成闪卡。请重试。',
    errorGenerating: '❌ 生成错误:',
    pleaseProvideContent: '❌ 请通过可用方法之一提供内容。',
    languageWarning: '⚠️ 起始语言和目标语言不能相同！请选择不同的语言。',
    noCardsToExport: '没有闪卡可导出。',
    generatingPPT: '正在生成PowerPoint演示文稿...',
    errorGeneratingPPT: '❌ 生成PowerPoint演示文稿时出错。请重试。',
    pptLibraryNotLoaded: '❌ PowerPoint生成库未加载。请刷新页面并重试。',
    htmlPresentationGenerated: '✅ HTML演示文稿生成成功！您可以在任何網絡瀏覽器中打開它。',
    csvExported: 'CSV文件已導出',
    jsonExported: 'JSON文件已導出',
    amendContent: '📝 修改內容',
    exportToWord: '📄 导出为Word',
    exportToPPT: '📊 导出为PPT',
    startStudyMode: '🧑‍🏫 开始教学模式',
    generatedContent: '📄 生成的內容',
    changesSaved: '修改已保存'
  },
  'zh-HK': {
    pageTitle: '閃卡生成器',
    pageSubtitle: '創建具有多種學習模式的互動式閃卡',
    selectMode: '🎮 選擇閃卡模式',
    definitionMode: '定義模式',
    definitionDesc: '正面顯示術語，背面顯示定義。適合詞彙和概念學習。',
    translationMode: '翻譯模式',
    translationDesc: '正面顯示一種語言的單詞，背面顯示翻譯。',
    multipleChoiceMode: '多選題模式',
    multipleChoiceDesc: '正面顯示問題和選項，背面顯示正確答案。',
    fillBlankMode: '填空題模式',
    fillBlankDesc: '正面顯示不完整的句子，背面顯示缺失的單詞。',
    imageBasedMode: '圖片模式',
    imageBasedDesc: '正面顯示圖片，背面顯示描述或名稱。',
    contentSource: '📄 內容來源',
    uploadMaterials: '上傳材料 (PDF/DOC/TXT)',
    dragDropFiles: '📁 拖拽文件到此處或點擊瀏覽',
    useDatabase: '使用預加載數據庫 (HK/CN)',
    typeManually: '手動輸入內容',
    enterContent: '在此輸入您的內容...',
    uploadImages: '上傳圖片用於圖片模式',
    dragDropImages: '🖼️ 拖拽圖片文件到此處或點擊瀏覽',
    parameters: '⚙️ 參數設置',
    duration: '時長:',
    durationPlaceholder: '例如: 45分鐘',
    grade: '年級:',
    gradePlaceholder: '例如: 三年級',
    difficulty: '難度:',
    high: '高',
    mid: '中',
    low: '低',
    topic: '主題:',
    topicPlaceholder: '輸入主題...',
    translationSettings: '翻譯設置:',
    fromLanguage: '起始語言:',
    toLanguage: '目標語言:',
    cardCount: '閃卡數量:',
    generateCards: '✨ 生成閃卡',
    clickToStart: '點擊開始',
    backContent: '背面內容',
    previous: '← 上一張',
    next: '下一張 →',
    correct: '✅ 正確',
    incorrect: '❌ 錯誤',
    shuffle: '🔀 打亂',
    startStudy: '🎯 開始學習模式',
    exportOptions: '📤 導出選項',
    exportWord: '導出為Word',
    exportPPT: '導出為PPT',
    exportCSV: '導出為CSV',
    exportJSON: '導出為JSON',
    generatedCards: '📄 生成的閃卡',
    clickToFlip: '💡 點擊任意卡片翻轉查看答案。使用下方按鈕開始互動式學習模式或導出。',
    flipAll: '🔄 翻轉所有卡片',
    resetAll: '🔄 重置所有卡片',
    selectedBooks: '已選書籍:',
    noCardsAvailable: '沒有可用的閃卡。請先生成內容。',
    generatingCards: '正在生成閃卡...',
    noCardsGenerated: '❌ 沒有生成閃卡。請重試。',
    errorGenerating: '❌ 生成錯誤:',
    pleaseProvideContent: '❌ 請通過可用方法之一提供內容。',
    languageWarning: '⚠️ 起始語言和目標語言不能相同！請選擇不同的語言。',
    noCardsToExport: '沒有閃卡可導出。',
    generatingPPT: '正在生成PowerPoint演示文稿...',
    errorGeneratingPPT: '❌ 生成PowerPoint演示文稿時出錯。請重試。',
    pptLibraryNotLoaded: '❌ PowerPoint生成庫未加載。請刷新頁面並重試。',
    htmlPresentationGenerated: '✅ HTML演示文稿生成成功！您可以在任何網絡瀏覽器中打開它。',
    csvExported: 'CSV文件已導出',
    jsonExported: 'JSON文件已導出',
    amendContent: '📝 修改內容',
    exportToWord: '� 導出為Word',
    exportToPPT: '📊 導出為PPT',
    startStudyMode: '🧑‍🏫 開始敎學模式',
    generatedContent: '📄 生成的內容',
    changesSaved: '修改已保存'
  },
  'en': {
    pageTitle: 'Flash Card Generator',
    pageSubtitle: 'Create interactive flashcards with multiple learning modes',
    selectMode: '🎮 Select Flashcard Mode',
    definitionMode: 'Definition Mode',
    definitionDesc: 'Term on front, definition on back. Perfect for vocabulary and concepts.',
    translationMode: 'Translation Mode',
    translationDesc: 'Word in one language on front, translation on back.',
    multipleChoiceMode: 'Multiple Choice',
    multipleChoiceDesc: 'Question and options on front, correct answer on back.',
    fillBlankMode: 'Fill in the Blank',
    fillBlankDesc: 'Incomplete sentence on front, missing word on back.',
    imageBasedMode: 'Image-Based',
    imageBasedDesc: 'Image on front, description or name on back.',
    contentSource: '📄 Content Source',
    uploadMaterials: 'Upload Materials (PDF/DOC/TXT)',
    dragDropFiles: '📁 Drag and drop files here or click to browse',
    useDatabase: 'Use Pre-loaded Database (HK/CN)',
    typeManually: 'Type Content Manually',
    enterContent: 'Enter your content here...',
    uploadImages: 'Upload Images for Image-Based Mode',
    dragDropImages: '🖼️ Drag and drop image files here or click to browse',
    parameters: '⚙️ Parameters',
    duration: 'Duration:',
    durationPlaceholder: 'e.g. 45 mins',
    grade: 'Grade:',
    gradePlaceholder: 'e.g. Grade 3',
    difficulty: 'Difficulty:',
    high: 'High',
    mid: 'Mid',
    low: 'Low',
    topic: 'Topic:',
    topicPlaceholder: 'Enter topic...',
    translationSettings: 'Translation Settings:',
    fromLanguage: 'From Language:',
    toLanguage: 'To Language:',
    cardCount: 'Number of Flashcards:',
    generateCards: '✨ Generate Flash Cards',
    clickToStart: 'Click to start',
    backContent: 'Back content',
    previous: '← Previous',
    next: 'Next →',
    correct: '✅ Correct',
    incorrect: '❌ Incorrect',
    shuffle: '🔀 Shuffle',
    startStudy: '🧑‍🏫 Start Teaching Mode',
    exportOptions: '📤 Export Options',
    exportWord: 'Export as Word',
    exportPPT: 'Export as PPT',
    exportCSV: 'Export as CSV',
    exportJSON: 'Export as JSON',
    generatedCards: '📄 Generated Flashcards',
    clickToFlip: '💡 Click any card to flip and see the answer. Use the buttons below to start interactive study mode or export.',
    flipAll: '🔄 Flip All Cards',
    resetAll: '🔄 Reset All Cards',
    selectedBooks: 'Selected Books:',
    noCardsAvailable: 'No flashcards available. Please generate content first.',
    generatingCards: 'Generating flashcards...',
    noCardsGenerated: '❌ No flashcards were generated. Please try again.',
    errorGenerating: '❌ Error:',
    pleaseProvideContent: '❌ Please provide content through one of the available methods.',
    languageWarning: '⚠️ From language and to language cannot be the same! Please select different languages.',
    noCardsToExport: 'No flashcards to export.',
    generatingPPT: 'Generating PowerPoint presentation...',
    errorGeneratingPPT: '❌ Error generating PowerPoint presentation. Please try again.',
    pptLibraryNotLoaded: '❌ PowerPoint generation library not loaded. Please refresh the page and try again.',
    htmlPresentationGenerated: '✅ HTML presentation generated successfully! You can open it in any web browser.',
    csvExported: 'CSV file exported',
    jsonExported: 'JSON file exported',
    amendContent: '📝 Amend',
    exportToWord: '📄 Export to Word',
    exportToPPT: '📊 Export to PPT',
    startStudyMode: '🧑‍🏫 Start Teaching Mode',
    generatedContent: '📄 Generated Content',
    changesSaved: 'Changes saved'
  }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeBooksList();
  setupEventListeners();
  setupFileUpload();
  
  // Set default mode
  document.querySelector('.mode-card[data-mode="definition"]').classList.add('selected');
  
  // Initialize page language based on HTML lang attribute
  updatePageLanguage();
});

function getLanguage() {
    const lang = (document.documentElement.lang || 'en').toLowerCase();
    if (lang === 'zh-hk' || lang === 'zh-tw') {
        return 'zh-HK';
    }
    if (lang.startsWith('zh')) { // Catches 'zh', 'zh-cn', etc.
        return 'zh';
    }
    return 'en'; // Default to English
}

function updatePageLanguage() {
  const lang = getLanguage();
  const t = translations[lang];
  
  document.getElementById('pageTitle').textContent = t.pageTitle;
  document.getElementById('pageSubtitle').textContent = t.pageSubtitle;
  document.getElementById('selectModeTitle').textContent = t.selectMode;
  document.getElementById('definitionModeTitle').textContent = t.definitionMode;
  document.getElementById('definitionModeDesc').textContent = t.definitionDesc;
  document.getElementById('translationModeTitle').textContent = t.translationMode;
  document.getElementById('translationModeDesc').textContent = t.translationDesc;
  document.getElementById('multipleChoiceModeTitle').textContent = t.multipleChoiceMode;
  document.getElementById('multipleChoiceModeDesc').textContent = t.multipleChoiceDesc;
  document.getElementById('fillBlankModeTitle').textContent = t.fillBlankMode;
  document.getElementById('fillBlankModeDesc').textContent = t.fillBlankDesc;
  document.getElementById('imageBasedModeTitle').textContent = t.imageBasedMode;
  document.getElementById('imageBasedModeDesc').textContent = t.imageBasedDesc;
  document.getElementById('contentSourceTitle').textContent = t.contentSource;
  document.getElementById('uploadMaterialsLabel').textContent = t.uploadMaterials;
  document.getElementById('useDatabaseLabel').textContent = t.useDatabase;
  document.getElementById('typeManuallyLabel').textContent = t.typeManually;
  document.getElementById('uploadImagesLabel').textContent = t.uploadImages;
  document.getElementById('dragDropFilesText').textContent = t.dragDropFiles;
  document.getElementById('dragDropImagesText').textContent = t.dragDropImages;
  document.getElementById('selectedBooksTitle').textContent = t.selectedBooks;
  document.getElementById('manualContent').placeholder = t.enterContent;
  document.getElementById('duration').placeholder = t.durationPlaceholder;
  document.getElementById('grade').placeholder = t.gradePlaceholder;
  document.getElementById('topic').placeholder = t.topicPlaceholder;
  document.getElementById('parametersTitle').textContent = t.parameters;
  document.getElementById('durationLabel').textContent = t.duration;
  document.getElementById('gradeLabel').textContent = t.grade;
  document.getElementById('difficultyLabel').textContent = t.difficulty;
  document.getElementById('topicLabel').textContent = t.topic;
  document.getElementById('cardCountLabel').textContent = t.cardCount;
  document.getElementById('translationSettingsLabel').textContent = t.translationSettings;
  document.getElementById('fromLanguageLabel').textContent = t.fromLanguage;
  document.getElementById('toLanguageLabel').textContent = t.toLanguage;
  document.getElementById('difficultyHigh').textContent = t.high;
  document.getElementById('difficultyMid').textContent = t.mid;
  document.getElementById('difficultyLow').textContent = t.low;
  document.getElementById('generateButton').textContent = t.generateCards;
  document.getElementById('cardFront').textContent = t.clickToStart;
  document.getElementById('cardBack').textContent = t.backContent;
  document.getElementById('prevButton').textContent = t.previous;
  document.getElementById('nextButton').textContent = t.next;
  document.getElementById('correctButton').textContent = t.correct;
  document.getElementById('incorrectButton').textContent = t.incorrect;
  document.getElementById('shuffleButton').textContent = t.shuffle;
  document.getElementById('generatedContentTitle').textContent = t.generatedContent;
  document.getElementById('amendButton').textContent = t.amendContent;
  document.getElementById('exportWordButton').textContent = t.exportToWord;
  document.getElementById('exportPPTButton').textContent = t.exportToPPT;
  document.getElementById('exportCSVButton').textContent = t.exportCSV;
  document.getElementById('exportJSONButton').textContent = t.exportJSON;
  document.getElementById('startStudyButton').textContent = t.startStudyMode;
}

function setupEventListeners() {
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', function() {
      document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      currentMode = this.dataset.mode;
      
      const translationOptions = document.getElementById('translationOptions');
      translationOptions.style.display = (currentMode === 'translation') ? 'block' : 'none';
      
      const imageUploadSection = document.getElementById('imageUploadSection');
      imageUploadSection.style.display = (currentMode === 'image-based') ? 'block' : 'none';
    });
  });

  document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
    radio.addEventListener('change', function() {
      document.querySelectorAll('.radio-group label').forEach(label => label.classList.remove('checked'));
      this.parentElement.classList.add('checked');
    });
  });
  
  const checkedDifficulty = document.querySelector('input[name="difficulty"]:checked');
  if (checkedDifficulty) {
    checkedDifficulty.parentElement.classList.add('checked');
  }

  document.querySelectorAll('input[name="contentSource"]').forEach(radio => {
    radio.addEventListener('change', function() {
      document.getElementById('uploadSection').style.display = (this.value === 'upload') ? 'block' : 'none';
      document.getElementById('databaseSection').style.display = (this.value === 'database') ? 'block' : 'none';
      document.getElementById('manualSection').style.display = (this.value === 'manual') ? 'block' : 'none';
    });
  });

  document.getElementById('fromLanguage').addEventListener('change', validateLanguageSelection);
  document.getElementById('toLanguage').addEventListener('change', validateLanguageSelection);
}

function setupFileUpload() {
  const fileUploadArea = document.getElementById('fileUploadArea');
  const fileInput = document.getElementById('fileInput');

  fileUploadArea.addEventListener('click', () => fileInput.click());
  fileUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); fileUploadArea.classList.add('dragover'); });
  fileUploadArea.addEventListener('dragleave', () => fileUploadArea.classList.remove('dragover'));
  fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    fileInput.files = e.dataTransfer.files;
    updateFileList();
  });
  fileInput.addEventListener('change', updateFileList);
  
  const imageUploadArea = document.getElementById('imageUploadArea');
  const imageInput = document.getElementById('imageInput');
  
  if (imageUploadArea && imageInput) {
    imageUploadArea.addEventListener('click', () => imageInput.click());
    imageUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); imageUploadArea.classList.add('dragover'); });
    imageUploadArea.addEventListener('dragleave', () => imageUploadArea.classList.remove('dragover'));
    imageUploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      imageUploadArea.classList.remove('dragover');
      imageInput.files = e.dataTransfer.files;
      updateImageList();
    });
    imageInput.addEventListener('change', updateImageList);
  }
}

function updateFileList() {
  const fileList = document.getElementById('fileList');
  const fileInput = document.getElementById('fileInput');
  fileList.innerHTML = '';
  for (const file of fileInput.files) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `<span>${file.name}</span><button onclick="removeFile(this)">Remove</button>`;
    fileList.appendChild(fileItem);
  }
}

function removeFile(button) { button.parentElement.remove(); }

function updateImageList() {
  const imageList = document.getElementById('imageList');
  const imageInput = document.getElementById('imageInput');
  imageList.innerHTML = '';
  for (const file of imageInput.files) {
    const imageItem = document.createElement('div');
    imageItem.className = 'file-item';
    imageItem.innerHTML = `<span>${file.name}</span><button onclick="removeImage(this)">Remove</button>`;
    imageList.appendChild(imageItem);
  }
}

function removeImage(button) { button.parentElement.remove(); }

function initializeBooksList() {
  const bookList = document.getElementById('bookList');
  if (!bookList || typeof regions === 'undefined') return;
  bookList.innerHTML = '';

  Object.entries(regions).forEach(([regionKey, regionData]) => {
    const regionTitle = document.createElement('div');
    regionTitle.className = 'region-title';
    regionTitle.textContent = '📚 ' + regionData.name;
    
    const regionContent = document.createElement('div');
    regionContent.className = 'region-content';
    
    regionTitle.addEventListener('click', () => {
      regionContent.style.display = regionContent.style.display === 'none' ? 'block' : 'none';
    });

    bookList.appendChild(regionTitle);
    bookList.appendChild(regionContent);

    const groupMap = {};
    regionData.books.forEach(book => {
      const group = book.path || '香港教材类';
      if (!groupMap[group]) groupMap[group] = [];
      groupMap[group].push(book);
    });

    Object.keys(groupMap).sort().forEach(group => {
      const title = document.createElement('div');
      title.className = 'group-title';
      title.textContent = '📂 ' + group;
      regionContent.appendChild(title);

      groupMap[group].sort((a, b) => a.title.localeCompare(b.title)).forEach(book => {
        const div = document.createElement('div');
        div.className = 'book-item';
        div.textContent = book.title;
        div.dataset.bookTitle = book.title;
        div.dataset.driveUrl = book.drive_url;
        div.addEventListener('click', () => toggleBookSelection(div, book));
        regionContent.appendChild(div);
      });
    });
  });
}

function toggleBookSelection(element, book) {
  const isSelected = element.classList.toggle('selected');
  if (isSelected) {
    selectedBooks.push(book);
  } else {
    selectedBooks = selectedBooks.filter(b => b.title !== book.title);
  }
  updateSelectedBooksList();
}

function updateSelectedBooksList() {
  const selectedBooksList = document.getElementById('selectedBooksList');
  selectedBooksList.innerHTML = '';
  selectedBooks.forEach(book => {
    const div = document.createElement('div');
    div.className = 'selected-book';
    div.innerHTML = `<span>${book.title}</span><button onclick="removeSelectedBook('${book.title}')">×</button>`;
    selectedBooksList.appendChild(div);
  });
}

function removeSelectedBook(bookTitle) {
  selectedBooks = selectedBooks.filter(b => b.title !== bookTitle);
  updateSelectedBooksList();
  document.querySelector(`.book-item[data-book-title="${bookTitle}"]`)?.classList.remove('selected');
}

async function generateFlashCards() {
    const contentSource = document.querySelector('input[name="contentSource"]:checked').value;
    const duration = document.getElementById('duration').value.trim();
    const grade = document.getElementById('grade').value.trim();
    const topic = document.getElementById('topic').value.trim();
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const cardCount = document.getElementById('cardCount').value;
    const fromLanguage = document.getElementById('fromLanguage').value;
    const toLanguage = document.getElementById('toLanguage').value;
    const lang = getLanguage();
    const t = translations[lang];

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<div class="loading">${t.generatingCards}</div>`;
    document.getElementById('resultSection').style.display = 'block';

    let textContent = '';
    if (contentSource === 'upload') {
        const fileInput = document.getElementById('fileInput');
        if (fileInput.files.length > 0) {
            for (const file of fileInput.files) {
                textContent += `\n[File: ${file.name}]\n${await file.text()}`;
            }
        }
    } else if (contentSource === 'database') {
        if (selectedBooks.length > 0) {
            textContent = '[Selected Books from Database]\n' + selectedBooks.map(b => `📖 ${b.title}\n🔗 ${b.drive_url}`).join('\n');
        }
    } else if (contentSource === 'manual') {
        textContent = document.getElementById('manualContent').value.trim();
    } else if (contentSource === 'images') {
        const imageInput = document.getElementById('imageInput');
        if (imageInput.files.length > 0) {
            textContent = '[Uploaded Images]\n' + Array.from(imageInput.files).map(f => `📷 ${f.name}`).join('\n');
        }
    }

    if (!textContent) {
        resultDiv.innerHTML = `❌ ${t.pleaseProvideContent}`;
        return;
    }

    try {
        const response = await fetch("https://backend.canpaniongroup.com/aigc/generate-flashcard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ textContent, currentMode, cardCount, topic, difficulty, grade, duration, fromLanguage, toLanguage, lang })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data.flashcards && Array.isArray(data.flashcards)) {
            flashcards = data.flashcards;
            totalCards = flashcards.length;
            console.log(`Successfully received ${totalCards} structured flashcards.`);
            displayGeneratedFlashcards();
        } else {
             throw new Error(t.noCardsGenerated);
        }

    } catch (error) {
        resultDiv.innerHTML = `❌ ${t.errorGenerating} ${error.message}`;
        console.error('Error generating flashcards:', error);
    }
}

function displayGeneratedFlashcards() {
    const resultDiv = document.getElementById('result');
    const lang = getLanguage();
    const t = translations[lang];

    if (flashcards.length === 0) {
        resultDiv.innerHTML = `<div class="loading">${t.noCardsGenerated}</div>`;
        return;
    }

    let html = `<div class="generated-flashcards-container">
        <h3>${t.generatedCards} (${flashcards.length} cards)</h3>`;

    if (currentMode === 'translation') {
        html += `<div> - ${document.getElementById('fromLanguage').value} → ${document.getElementById('toLanguage').value}</div>`;
    }

    html += '<div class="generated-flashcards-grid">';
    flashcards.forEach((card, index) => {
        let frontContent;
        if (currentMode === 'multiple-choice' && typeof card.front === 'object' && card.front !== null) {
            frontContent = `<div class="mc-question">${escapeHtml(card.front.question)}</div>
                <div class="mc-options-no-border">
                    ${(card.front.options || []).map((option, i) => `<div>(${(String.fromCharCode(97 + i))}) ${escapeHtml(option)}</div>`).join('')}
                </div>`;
        } else {
            const isImageUrl = isImageLink(card.front);
            frontContent = isImageUrl ? `<img src="${card.front}" alt="Image" style="max-width: 100%; max-height: 200px; object-fit: contain;">` : escapeHtml(card.front);
        }

        // UPDATED: Add prefix to the back of the card for multiple choice
        let backContent = escapeHtml(card.back);
        if (currentMode === 'multiple-choice' && typeof card.front === 'object' && card.front.options) {
            const correctIndex = card.front.options.indexOf(card.back);
            if (correctIndex !== -1) {
                backContent = `(${(String.fromCharCode(97 + correctIndex))}) ${escapeHtml(card.back)}`;
            }
        }

        html += `<div class="generated-flashcard" onclick="flipGeneratedCard(this)">
            <div class="generated-flashcard-inner">
                <div class="generated-front">
                    <div class="card-number">#${index + 1}</div>
                    <div class="card-content">${frontContent}</div>
                </div>
                <div class="generated-back">
                    <div class="card-number">#${index + 1}</div>
                    <div class="card-content">${backContent}</div>
                </div>
            </div>
        </div>`;
    });

    html += `</div>
        <div class="generated-instructions">
            <p>${t.clickToFlip}</p>
            <div class="generated-controls">
                <button class="btn btn-secondary" onclick="flipAllGeneratedCards()">🔄 ${t.flipAll}</button>
                <button class="btn btn-primary" onclick="resetAllGeneratedCards()">🔄 ${t.resetAll}</button>
            </div>
        </div>
    </div>`;
    resultDiv.innerHTML = html;
}

function flipGeneratedCard(card) { card.classList.toggle('flipped'); }

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/\n/g, '<br>');
}

function isImageLink(text) {
  if (typeof text !== 'string') return false;
  const urlPattern = /^https?:\/\/.+/i;
  return urlPattern.test(text) && ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'].some(ext => text.toLowerCase().includes(ext));
}

function validateLanguageSelection() {
  const fromLanguage = document.getElementById('fromLanguage');
  const toLanguage = document.getElementById('toLanguage');
  if (fromLanguage.value === toLanguage.value) {
    alert(translations[getLanguage()].languageWarning);
    // Simple logic to ensure they are different
    toLanguage.selectedIndex = (fromLanguage.selectedIndex + 1) % toLanguage.options.length;
  }
}

function flipAllGeneratedCards() { document.querySelectorAll('.generated-flashcard').forEach(card => card.classList.add('flipped')); }
function resetAllGeneratedCards() { document.querySelectorAll('.generated-flashcard').forEach(card => card.classList.remove('flipped')); }

function startFlashcardMode() {
  const lang = getLanguage();
  const t = translations[lang];
  if (flashcards.length === 0) {
    alert(t.noCardsAvailable);
    return;
  }
  currentCardIndex = 0;
  correctAnswers = 0;
  document.getElementById('flashcardContainer').style.display = 'block';
  document.getElementById('resultSection').style.display = 'none';
  document.documentElement.requestFullscreen?.();
  
  let backBtn = document.getElementById('flashcardBackButton');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'flashcardBackButton';
    backBtn.className = 'btn btn-secondary';
    backBtn.style.cssText = 'position: absolute; top: 24px; left: 24px; z-index: 1000;';
    backBtn.textContent = `← ${lang === 'en' ? 'Back' : '返回'}`;
    backBtn.onclick = function() {
      document.exitFullscreen?.();
      document.getElementById('flashcardContainer').style.display = 'none';
      document.getElementById('resultSection').style.display = 'block';
    };
    document.getElementById('flashcardContainer').appendChild(backBtn);
  }
  showCurrentCard();
}

function showCurrentCard() {
  if (flashcards.length === 0) return;
  const card = flashcards[currentCardIndex];
  const cardFrontElement = document.getElementById('cardFront');
  
  if (currentMode === 'multiple-choice' && typeof card.front === 'object' && card.front !== null) {
    cardFrontElement.innerHTML = `<div class="mc-question">${escapeHtml(card.front.question)}</div>
        <div class="mc-options-no-border">${(card.front.options || []).map((o, i) => `<div>(${(String.fromCharCode(97 + i))}) ${escapeHtml(o)}</div>`).join('')}</div>`;
  } else if (currentMode === 'image-based' && isImageLink(card.front)) {
    cardFrontElement.innerHTML = `<img src="${card.front}" alt="Image" style="max-width: 100%; max-height: 300px; object-fit: contain;">`;
  } else {
    cardFrontElement.textContent = card.front;
  }
  
  // UPDATED: Add prefix to the back of the card in study mode
  let backContent = card.back;
  if (currentMode === 'multiple-choice' && typeof card.front === 'object' && card.front.options) {
      const correctIndex = card.front.options.indexOf(card.back);
      if (correctIndex !== -1) {
          backContent = `(${(String.fromCharCode(97 + correctIndex))}) ${card.back}`;
      }
  }
  document.getElementById('cardBack').textContent = backContent;

  document.getElementById('cardCounter').textContent = `${currentCardIndex + 1} / ${totalCards}`;
  document.getElementById('progressFill').style.width = `${((currentCardIndex + 1) / totalCards) * 100}%`;
  document.getElementById('flashcard').classList.remove('flipped');
}

function flipCard() { document.getElementById('flashcard').classList.toggle('flipped'); }
function nextCard() { if (currentCardIndex < totalCards - 1) { currentCardIndex++; showCurrentCard(); } }
function previousCard() { if (currentCardIndex > 0) { currentCardIndex--; showCurrentCard(); } }
function markAsCorrect() { correctAnswers++; nextCard(); }
function markAsIncorrect() { nextCard(); }

function shuffleCards() {
  for (let i = flashcards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
  }
  currentCardIndex = 0;
  showCurrentCard();
}

function amendContent() {
    const container = document.querySelector('.generated-flashcards-container');
    if (!container) return;

    const lang = getLanguage();
    const t = translations[lang];
    const isEditMode = container.classList.toggle('edit-mode');
    document.getElementById('amendButton').textContent = isEditMode ? `💾 ${t.changesSaved || 'Save Changes'}` : t.amendContent;

    if (isEditMode) {
        container.querySelectorAll('.generated-flashcard').forEach((cardEl, index) => {
            const cardData = flashcards[index];
            const frontEl = cardEl.querySelector('.generated-front .card-content');
            const backEl = cardEl.querySelector('.generated-back .card-content');
            
            let frontText;
            if (currentMode === 'multiple-choice' && typeof cardData.front === 'object' && cardData.front !== null) {
                frontText = `${cardData.front.question || ''}\n${(cardData.front.options || []).join('\n')}`;
            } else {
                frontText = cardData.front;
            }
            
            frontEl.innerHTML = `<textarea class="edit-textarea">${frontText}</textarea>`;
            backEl.innerHTML = `<textarea class="edit-textarea">${cardData.back || ''}</textarea>`;
        });
    } else { // Saving changes
        const editedFlashcards = [];
        container.querySelectorAll('.generated-flashcard').forEach((cardEl) => {
            const frontTextarea = cardEl.querySelector('.generated-front textarea');
            const backTextarea = cardEl.querySelector('.generated-back textarea');
            const newBackContent = backTextarea.value;
            let newFrontContent;

            if (currentMode === 'multiple-choice') {
                const lines = frontTextarea.value.split('\n').filter(line => line.trim() !== '');
                newFrontContent = {
                    question: lines[0] || '',
                    options: lines.slice(1)
                };
            } else {
                newFrontContent = frontTextarea.value;
            }
            
            editedFlashcards.push({ front: newFrontContent, back: newBackContent });
        });
        flashcards = editedFlashcards;
        displayGeneratedFlashcards(); // Re-render the cards with the saved content
        alert(t.changesSaved);
    }
}

function getModeDisplayName(mode) {
    const lang = getLanguage();
    const names = {
        'zh': { definition: '定义模式', translation: '翻译模式', 'multiple-choice': '多选题模式', 'fill-blank': '填空题模式', 'image-based': '图片模式' },
        'zh-HK': { definition: '定義模式', translation: '翻譯模式', 'multiple-choice': '多選題模式', 'fill-blank': '填空題模式', 'image-based': '圖片模式' },
        'en': { definition: 'Definition Mode', translation: 'Translation Mode', 'multiple-choice': 'Multiple Choice Mode', 'fill-blank': 'Fill in the Blank Mode', 'image-based': 'Image-Based Mode' }
    };
    return (names[lang] && names[lang][mode]) || mode;
}

function downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

function exportToWord() {
    if (flashcards.length === 0) return alert(translations[getLanguage()].noCardsToExport);
    let content = flashcards.map(card => {
        let frontText;
        if (currentMode === 'multiple-choice' && typeof card.front === 'object') {
            const optionsText = (card.front.options || []).map((opt, i) => `    (${(String.fromCharCode(97 + i))}) ${opt}`).join('\n');
            frontText = `Question: ${card.front.question}\nOptions:\n${optionsText}`;
        } else {
            frontText = `Front: ${card.front}`;
        }

        // UPDATED: Add prefix to the back text for Word export
        let backText = card.back;
        if (currentMode === 'multiple-choice' && typeof card.front === 'object' && card.front.options) {
            const correctIndex = card.front.options.indexOf(card.back);
            if (correctIndex !== -1) {
                backText = `(${(String.fromCharCode(97 + correctIndex))}) ${card.back}`;
            }
        }
        return `${frontText}\nBack: ${backText}\n\n---\n\n`;
    }).join('');
    downloadFile(content, 'flashcards.doc', 'application/msword;charset=utf-8');
}

function exportToCSV() {
    if (flashcards.length === 0) return alert(translations[getLanguage()].noCardsToExport);
    let csv = 'Front,Back\n';
    flashcards.forEach(card => {
        let frontValue;
        if (typeof card.front === 'object') {
            const optionsText = (card.front.options || []).map((opt, i) => `(${(String.fromCharCode(97 + i))}) ${opt}`).join('; ');
            frontValue = `${card.front.question} [${optionsText}]`;
        } else {
            frontValue = card.front;
        }

        // UPDATED: Add prefix to the back value for CSV export
        let backValue = card.back;
        if (currentMode === 'multiple-choice' && typeof card.front === 'object' && card.front.options) {
            const correctIndex = card.front.options.indexOf(card.back);
            if (correctIndex !== -1) {
                backValue = `(${(String.fromCharCode(97 + correctIndex))}) ${card.back}`;
            }
        }
        csv += `"${String(frontValue).replace(/"/g, '""')}","${String(backValue).replace(/"/g, '""')}"\n`;
    });
    downloadFile(csv, 'flashcards.csv', 'text/csv;charset=utf-8;');
}

function exportToJSON() {
    if (flashcards.length === 0) return alert(translations[getLanguage()].noCardsToExport);
    const data = {
        mode: currentMode,
        topic: document.getElementById('topic').value,
        grade: document.getElementById('grade').value,
        difficulty: document.querySelector('input[name="difficulty"]:checked').value,
        flashcards: flashcards,
        generatedAt: new Date().toISOString()
    };
    downloadFile(JSON.stringify(data, null, 2), 'flashcards.json', 'application/json;charset=utf-8;');
}

function generatePPT() {
    const lang = getLanguage();
    const t = translations[lang];
    if (flashcards.length === 0) return alert(t.noCardsToExport);
    if (typeof PptxGenJS === 'undefined') return generateHTMLPresentation();

    const resultDiv = document.getElementById('result');
    const originalContent = resultDiv.innerHTML;
    resultDiv.innerHTML = `<div class="loading">${t.generatingPPT}</div>`;

    try {
        const pptx = new PptxGenJS();
        pptx.author = 'Flashcard Generator';
        pptx.title = document.getElementById('topic').value || 'Flashcards';

        // Title Slide
        let titleSlide = pptx.addSlide();
        titleSlide.addText('Flashcards', { x: 1, y: 1, w: 8, h: 2, fontSize: 48, bold: true, align: 'center' });
        titleSlide.addText(`Topic: ${pptx.title}`, { x: 1, y: 3, w: 8, h: 1, fontSize: 28, align: 'center' });
        titleSlide.addText(`Mode: ${getModeDisplayName(currentMode)}`, { x: 1, y: 4, w: 8, h: 1, fontSize: 24, align: 'center' });

        // Card Slides
        flashcards.forEach((card, index) => {
            // Front slide
            let frontSlide = pptx.addSlide();
            frontSlide.addText(`Card ${index + 1} - Front`, { x: 0.5, y: 0.25, w: 9, h: 0.5, fontSize: 18, align: 'center' });
            if (currentMode === 'multiple-choice' && typeof card.front === 'object') {
                frontSlide.addText(card.front.question, { x: 1, y: 1.5, w: 8, h: 1.5, fontSize: 28, bold: true, align: 'center' });
                (card.front.options || []).forEach((option, i) => {
                    frontSlide.addText(`(${(String.fromCharCode(97 + i))}) ${option}`, { x: 1.5, y: 3.5 + i * 0.7, w: 7, h: 0.6, fontSize: 20 });
                });
            } else {
                frontSlide.addText(card.front, { x: 1, y: 2, w: 8, h: 3, fontSize: 36, bold: true, align: 'center', valign: 'middle' });
            }

            // Back slide
            let backSlide = pptx.addSlide();
            backSlide.addText(`Card ${index + 1} - Back`, { x: 0.5, y: 0.25, w: 9, h: 0.5, fontSize: 18, align: 'center' });
            
            // UPDATED: Add prefix to the back text for PPT export
            let backText = card.back;
            if (currentMode === 'multiple-choice' && typeof card.front === 'object' && card.front.options) {
                const correctIndex = card.front.options.indexOf(card.back);
                if (correctIndex !== -1) {
                    backText = `(${(String.fromCharCode(97 + correctIndex))}) ${card.back}`;
                }
            }
            backSlide.addText(backText, { x: 1, y: 2, w: 8, h: 3, fontSize: 36, bold: true, color: '0066CC', align: 'center', valign: 'middle' });
        });

        pptx.writeFile({ fileName: `flashcards_${pptx.title.replace(/[^a-z0-9]/gi, '_')}.pptx` })
            .then(() => alert('✅ PowerPoint presentation generated successfully!'))
            .catch(err => { throw err; })
            .finally(() => resultDiv.innerHTML = originalContent);

    } catch (error) {
        console.error('Error generating PPT:', error);
        resultDiv.innerHTML = originalContent;
        alert(t.errorGeneratingPPT);
    }
}

function generateHTMLPresentation() {
    const lang = getLanguage();
    const t = translations[lang];
    if (flashcards.length === 0) return alert(t.noCardsToExport);

    const topic = document.getElementById('topic').value || 'Flashcards';
    let slidesHtml = '';

    // Title Slide
    slidesHtml += `<div class="slide active"><h1>Flashcards</h1><h2>${topic}</h2><h3>Mode: ${getModeDisplayName(currentMode)}</h3></div>`;

    // Card Slides
    flashcards.forEach((card, index) => {
        let frontContent;
        if (currentMode === 'multiple-choice' && typeof card.front === 'object') {
            frontContent = `<h4>${escapeHtml(card.front.question)}</h4><ul>${(card.front.options || []).map((o, i) => `<li>(${(String.fromCharCode(97 + i))}) ${escapeHtml(o)}</li>`).join('')}</ul>`;
        } else {
            frontContent = `<h3>${escapeHtml(card.front)}</h3>`;
        }
        slidesHtml += `<div class="slide"><h4>Card ${index + 1} - Front</h4>${frontContent}</div>`;

        // UPDATED: Add prefix to the back content for HTML export
        let backContent = escapeHtml(card.back);
        if (currentMode === 'multiple-choice' && typeof card.front === 'object' && card.front.options) {
            const correctIndex = card.front.options.indexOf(card.back);
            if (correctIndex !== -1) {
                backContent = `(${(String.fromCharCode(97 + correctIndex))}) ${escapeHtml(card.back)}`;
            }
        }
        slidesHtml += `<div class="slide"><h4>Card ${index + 1} - Back</h4><h3 class="answer">${backContent}</h3></div>`;
    });

    const html = `<!DOCTYPE html>
<html>
<head>
<title>${topic} - Flashcards</title>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #f0f0f0; }
  .slide { display: none; width: 90%; max-width: 800px; min-height: 400px; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background: white; text-align: center; }
  .slide.active { display: flex; flex-direction: column; justify-content: center; align-items: center; }
  .controls { margin-bottom: 20px; } button { padding: 10px 20px; }
  .answer { color: #0066CC; } ul { list-style: none; padding: 0; } li { margin: 10px 0; }
</style>
</head>
<body>
<div class="controls"><button onclick="prev()">← Prev</button><button onclick="next()">Next →</button></div>
${slidesHtml}
<script>
  let current = 0;
  const slides = document.querySelectorAll('.slide');
  const show = n => { slides.forEach((s, i) => s.classList.toggle('active', i === n)); };
  const next = () => { current = (current + 1) % slides.length; show(current); };
  const prev = () => { current = (current - 1 + slides.length) % slides.length; show(current); };
  document.addEventListener('keydown', e => { if(e.key==='ArrowRight') next(); if(e.key==='ArrowLeft') prev(); });
  show(current);
<\/script>
</body>
</html>`;
    downloadFile(html, `flashcards_${topic.replace(/[^a-z0-9]/gi, '_')}.html`, 'text/html;charset=utf-8');
    alert(t.htmlPresentationGenerated);
}

// Keyboard navigation for flashcard mode
document.addEventListener('keydown', function(e) {
  if (document.getElementById('flashcardContainer').style.display === 'block') {
    switch(e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        nextCard();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        previousCard();
        break;
      case 'Enter':
      case 'ArrowUp':
      case 'ArrowDown':
        e.preventDefault();
        flipCard();
        break;
    }
  }
});