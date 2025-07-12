let selectedBooks = [];
let currentMode = 'definition';
let flashcards = [];
let currentCardIndex = 0;
let correctAnswers = 0;
let totalCards = 0;
let currentPageLanguage = 'zh-CN'; // Default to Simplified Chinese

// Multi-language text configuration
const translations = {
  'zh-CN': {
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
  'zh-TW': {
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
    exportToWord: '📄 導出為Word',
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
  
  // Initialize page language
  updatePageLanguage();
});

// Language switching function
function changePageLanguage() {
  currentPageLanguage = document.getElementById('pageLanguage').value;
  updatePageLanguage();
}

// Update all page text based on selected language
function updatePageLanguage() {
  const t = translations[currentPageLanguage];
  
  // Update page title and subtitle
  document.getElementById('pageTitle').textContent = t.pageTitle;
  document.getElementById('pageSubtitle').textContent = t.pageSubtitle;
  
  // Update section headers
  document.querySelector('.section h3').textContent = t.selectMode;
  
  // Update mode cards
  const modeCards = document.querySelectorAll('.mode-card');
  modeCards[0].querySelector('h4').textContent = t.definitionMode;
  modeCards[0].querySelector('p').textContent = t.definitionDesc;
  modeCards[1].querySelector('h4').textContent = t.translationMode;
  modeCards[1].querySelector('p').textContent = t.translationDesc;
  modeCards[2].querySelector('h4').textContent = t.multipleChoiceMode;
  modeCards[2].querySelector('p').textContent = t.multipleChoiceDesc;
  modeCards[3].querySelector('h4').textContent = t.fillBlankMode;
  modeCards[3].querySelector('p').textContent = t.fillBlankDesc;
  modeCards[4].querySelector('h4').textContent = t.imageBasedMode;
  modeCards[4].querySelector('p').textContent = t.imageBasedDesc;
  
  // Update content source section
  document.querySelectorAll('.section')[1].querySelector('h3').textContent = t.contentSource;
  
  // Update form labels and placeholders - preserve child elements
  // Find labels by their position in the form groups
  const formGroups = document.querySelectorAll('.form-group');
  
  // Update upload materials label (first form group)
  if (formGroups[0]) {
    const uploadLabel = formGroups[0].querySelector('label');
    if (uploadLabel) {
      // Clear all text nodes and set new text
      const textNodes = Array.from(uploadLabel.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
      textNodes.forEach(node => node.remove());
      uploadLabel.appendChild(document.createTextNode(t.uploadMaterials));
    }
  }
  
  // Update database label (second form group)
  if (formGroups[1]) {
    const databaseLabel = formGroups[1].querySelector('label');
    if (databaseLabel) {
      // Clear all text nodes and set new text
      const textNodes = Array.from(databaseLabel.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
      textNodes.forEach(node => node.remove());
      databaseLabel.appendChild(document.createTextNode(t.useDatabase));
    }
  }
  
  // Update manual input label (third form group)
  if (formGroups[2]) {
    const manualLabel = formGroups[2].querySelector('label');
    if (manualLabel) {
      // Clear all text nodes and set new text
      const textNodes = Array.from(manualLabel.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
      textNodes.forEach(node => node.remove());
      manualLabel.appendChild(document.createTextNode(t.typeManually));
    }
  }
  
  // Update images label (fourth form group)
  if (formGroups[3]) {
    const imagesLabel = formGroups[3].querySelector('label');
    if (imagesLabel) {
      // Clear all text nodes and set new text
      const textNodes = Array.from(imagesLabel.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
      textNodes.forEach(node => node.remove());
      imagesLabel.appendChild(document.createTextNode(t.uploadImages));
    }
  }
  
  // Update placeholders
  document.getElementById('manualContent').placeholder = t.enterContent;
  document.getElementById('duration').placeholder = t.durationPlaceholder;
  document.getElementById('grade').placeholder = t.gradePlaceholder;
  document.getElementById('topic').placeholder = t.topicPlaceholder;
  
  // Update parameters section
  document.querySelectorAll('.section')[2].querySelector('h3').textContent = t.parameters;
  
  // Update labels - use more specific selectors to avoid conflicts
  // Duration label
  const durationInput = document.getElementById('duration');
  if (durationInput) {
    const durationLabel = durationInput.parentElement.querySelector('label');
    if (durationLabel) durationLabel.textContent = t.duration;
  }
  
  // Grade label
  const gradeInput = document.getElementById('grade');
  if (gradeInput) {
    const gradeLabel = gradeInput.parentElement.querySelector('label');
    if (gradeLabel) gradeLabel.textContent = t.grade;
  }
  
  // Difficulty label
  const difficultyGroup = document.querySelector('.form-group .radio-group');
  if (difficultyGroup) {
    const difficultyLabel = difficultyGroup.parentElement.querySelector('label');
    if (difficultyLabel) difficultyLabel.textContent = t.difficulty;
  }
  
  // Topic label
  const topicInput = document.getElementById('topic');
  if (topicInput) {
    const topicLabel = topicInput.parentElement.querySelector('label');
    if (topicLabel) topicLabel.textContent = t.topic;
  }
  
  // Card count label
  const cardCountInput = document.getElementById('cardCount');
  if (cardCountInput) {
    const cardCountLabel = cardCountInput.parentElement.querySelector('label');
    if (cardCountLabel) cardCountLabel.textContent = t.cardCount;
  }
  
  // Translation settings label
  const translationOptions = document.getElementById('translationOptions');
  if (translationOptions) {
    const translationSettingsLabel = translationOptions.querySelector('label');
    if (translationSettingsLabel) translationSettingsLabel.textContent = t.translationSettings;
  }
  
  // From language label
  const fromLanguageSelect = document.getElementById('fromLanguage');
  if (fromLanguageSelect) {
    const fromLanguageLabel = fromLanguageSelect.parentElement.querySelector('label');
    if (fromLanguageLabel) fromLanguageLabel.textContent = t.fromLanguage;
  }
  
  // To language label
  const toLanguageSelect = document.getElementById('toLanguage');
  if (toLanguageSelect) {
    const toLanguageLabel = toLanguageSelect.parentElement.querySelector('label');
    if (toLanguageLabel) toLanguageLabel.textContent = t.toLanguage;
  }
  
  // Update difficulty options
  const difficultyLabels = document.querySelectorAll('.radio-group label');
  const difficultyInputs = document.querySelectorAll('input[name="difficulty"]');
  
  // Store current selection
  let selectedDifficulty = '';
  difficultyInputs.forEach(input => {
    if (input.checked) {
      selectedDifficulty = input.value;
    }
  });
  
  // Update labels - preserve radio buttons
  difficultyLabels.forEach((label, index) => {
    // Clear all text nodes and set new text
    const textNodes = Array.from(label.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
    textNodes.forEach(node => node.remove());
    
    // Add new text after the radio button
    const radioButton = label.querySelector('input');
    if (radioButton) {
      radioButton.insertAdjacentText('afterend', index === 0 ? t.high : index === 1 ? t.mid : t.low);
    }
  });
  
  // Restore selection
  difficultyInputs.forEach(input => {
    if (input.value === selectedDifficulty) {
      input.checked = true;
      input.parentElement.classList.add('checked');
    } else {
      input.parentElement.classList.remove('checked');
    }
  });
  
  // Update button text
  document.getElementById('generateButton').textContent = t.generateCards;
  
  // Update flashcard content
  document.getElementById('cardFront').textContent = t.clickToStart;
  document.getElementById('cardBack').textContent = t.backContent;
  
  // Update navigation buttons
  document.getElementById('prevButton').textContent = t.previous;
  document.getElementById('nextButton').textContent = t.next;
  
  // Update action buttons
  document.getElementById('correctButton').textContent = t.correct;
  document.getElementById('incorrectButton').textContent = t.incorrect;
  document.getElementById('shuffleButton').textContent = t.shuffle;
  
  // Update file upload text
  const fileUploadText = document.querySelector('#fileUploadArea p');
  if (fileUploadText) fileUploadText.textContent = t.dragDropFiles;
  
  const imageUploadText = document.querySelector('#imageUploadArea p');
  if (imageUploadText) imageUploadText.textContent = t.dragDropImages;
  
  // Update result section
  document.getElementById('generatedContentTitle').textContent = t.generatedContent;
  document.getElementById('amendButton').textContent = t.amendContent;
  document.getElementById('exportWordButton').textContent = t.exportToWord;
  document.getElementById('exportPPTButton').textContent = t.exportToPPT;
  document.getElementById('startStudyButton').textContent = t.startStudyMode;
}

function setupEventListeners() {
  // Mode selection
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', function() {
      document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      currentMode = this.dataset.mode;
      
      // Show/hide translation options based on selected mode
      const translationOptions = document.getElementById('translationOptions');
      if (currentMode === 'translation') {
        translationOptions.style.display = 'block';
      } else {
        translationOptions.style.display = 'none';
      }
      
      // Show/hide image upload section for image-based mode
      const imageUploadSection = document.getElementById('imageUploadSection');
      if (currentMode === 'image-based') {
        imageUploadSection.style.display = 'block';
      } else {
        imageUploadSection.style.display = 'none';
      }
    });
  });

  // Difficulty selection
  document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
    radio.addEventListener('change', function() {
      // Remove checked class from all difficulty labels
      document.querySelectorAll('.radio-group label').forEach(label => {
        label.classList.remove('checked');
      });
      
      // Add checked class to the selected label
      this.parentElement.classList.add('checked');
    });
  });
  
  // Initialize difficulty selection visual feedback
  const checkedDifficulty = document.querySelector('input[name="difficulty"]:checked');
  if (checkedDifficulty) {
    checkedDifficulty.parentElement.classList.add('checked');
  }

  // Content source radio buttons
  document.querySelectorAll('input[name="contentSource"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const uploadSection = document.getElementById('uploadSection');
      const databaseSection = document.getElementById('databaseSection');
      const manualSection = document.getElementById('manualSection');
      const imageUploadArea = document.getElementById('imageUploadArea');
      
      uploadSection.style.display = 'none';
      databaseSection.style.display = 'none';
      manualSection.style.display = 'none';
      imageUploadArea.style.display = 'none';
      
      if (this.value === 'upload') {
        uploadSection.style.display = 'block';
      } else if (this.value === 'database') {
        databaseSection.style.display = 'block';
      } else if (this.value === 'manual') {
        manualSection.style.display = 'block';
      } else if (this.value === 'images') {
        imageUploadArea.style.display = 'block';
      }
    });
  });

  // Language selection validation
  document.getElementById('fromLanguage').addEventListener('change', validateLanguageSelection);
  document.getElementById('toLanguage').addEventListener('change', validateLanguageSelection);
}

function setupFileUpload() {
  const fileUploadArea = document.getElementById('fileUploadArea');
  const fileInput = document.getElementById('fileInput');

  fileUploadArea.addEventListener('click', () => fileInput.click());
  
  fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
  });

  fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
  });

  fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    fileInput.files = e.dataTransfer.files;
    updateFileList();
  });

  fileInput.addEventListener('change', updateFileList);
  
  // Setup image upload
  const imageUploadArea = document.getElementById('imageUploadArea');
  const imageInput = document.getElementById('imageInput');
  
  if (imageUploadArea && imageInput) {
    imageUploadArea.addEventListener('click', () => imageInput.click());
    
    imageUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      imageUploadArea.classList.add('dragover');
    });

    imageUploadArea.addEventListener('dragleave', () => {
      imageUploadArea.classList.remove('dragover');
    });

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
    fileItem.innerHTML = '<span>' + file.name + '</span>' + '<button onclick="removeFile(this)">Remove</button>';
    fileList.appendChild(fileItem);
  }
}

function removeFile(button) {
  button.parentElement.remove();
}

function updateImageList() {
  const imageList = document.getElementById('imageList');
  const imageInput = document.getElementById('imageInput');
  imageList.innerHTML = '';
  
  for (const file of imageInput.files) {
    const imageItem = document.createElement('div');
    imageItem.className = 'file-item';
    imageItem.innerHTML = '<span>' + file.name + '</span>' + '<button onclick="removeImage(this)">Remove</button>';
    imageList.appendChild(imageItem);
  }
}

function removeImage(button) {
  button.parentElement.remove();
}

// Books functionality
function initializeBooksList() {
  const bookList = document.getElementById('bookList');
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

    const sortedGroupNames = Object.keys(groupMap).sort();
    sortedGroupNames.forEach(group => {
      const title = document.createElement('div');
      title.className = 'group-title';
      title.textContent = '📂 ' + group;
      regionContent.appendChild(title);

      const sortedBooks = groupMap[group].sort((a, b) => a.title.localeCompare(b.title));

      sortedBooks.forEach(book => {
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
  const isSelected = element.classList.contains('selected');
  
  if (isSelected) {
    element.classList.remove('selected');
    selectedBooks = selectedBooks.filter(b => b.title !== book.title);
  } else {
    element.classList.add('selected');
    selectedBooks.push(book);
  }
  
  updateSelectedBooksList();
}

function updateSelectedBooksList() {
  const selectedBooksList = document.getElementById('selectedBooksList');
  selectedBooksList.innerHTML = '';
  
  selectedBooks.forEach(book => {
    const div = document.createElement('div');
    div.className = 'selected-book';
    div.innerHTML = '<span>' + book.title + '</span>' + '<button onclick="removeSelectedBook(\'' + book.title + '\')">×</button>';
    selectedBooksList.appendChild(div);
  });
}

function removeSelectedBook(bookTitle) {
  selectedBooks = selectedBooks.filter(b => b.title !== bookTitle);
  updateSelectedBooksList();
  
  document.querySelectorAll('.book-item').forEach(item => {
    if (item.dataset.bookTitle === bookTitle) {
      item.classList.remove('selected');
    }
  });
}

async function generateFlashCards() {
  const contentSource = document.querySelector('input[name="contentSource"]:checked').value;
  const duration = document.getElementById('duration').value.trim();
  const grade = document.getElementById('grade').value.trim();
  const topic = document.getElementById('topic').value.trim();
  const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
  const cardCount = document.getElementById('cardCount').value;

  const resultDiv = document.getElementById('result');
  const t = translations[currentPageLanguage];
  resultDiv.innerHTML = '<div class="loading">' + t.generatingCards + '</div>';
  document.getElementById('resultSection').style.display = 'block';

  let textContent = '';
  
  if (contentSource === 'upload') {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
      for (const file of fileInput.files) {
        textContent += '\n[File: ' + file.name + ']\n';
        textContent += await file.text();
      }
    }
  } else if (contentSource === 'database') {
    if (selectedBooks.length > 0) {
      textContent = '[Selected Books from Database]\n';
      selectedBooks.forEach(book => {
        textContent += '\n📖 ' + book.title + '\n';
        textContent += '🔗 ' + book.drive_url + '\n';
      });
    }
  } else if (contentSource === 'manual') {
    textContent = document.getElementById('manualContent').value.trim();
  } else if (contentSource === 'images') {
    const imageInput = document.getElementById('imageInput');
    if (imageInput.files.length > 0) {
      textContent = '[Uploaded Images]\n';
      for (const file of imageInput.files) {
        textContent += '\n📷 ' + file.name + '\n';
      }
    }
  }

  if (!textContent) {
    resultDiv.innerHTML = '❌ ' + translations[currentPageLanguage].pleaseProvideContent;
    return;
  }

  // Get selected languages for translation mode
  const fromLanguage = document.getElementById('fromLanguage').value;
  const toLanguage = document.getElementById('toLanguage').value;
  
  const modePrompts = {
    definition: 'Create ' + cardCount + ' definition flashcards. Format: "Front: [term] | Back: [definition]",',
    translation: 'Create ' + cardCount + ' translation flashcards. Format: "Front: [' + fromLanguage + '] | Back: [' + toLanguage + ']",',
    'multiple-choice': 'Create ' + cardCount + ' multiple choice questions. IMPORTANT: Put the question on the first line of Front, then put each option (A, B, C, D) on separate lines. Format: "Front: [question]\\nA) [option1]\\nB) [option2]\\nC) [option3]\\nD) [option4] | Back: [correct answer letter and option]",',
    'fill-blank': 'Create ' + cardCount + ' fill-in-the-blank questions. Format: "Front: [sentence with ___] | Back: [missing word]",',
    'image-based': 'Create ' + cardCount + ' image-based flashcards. Format: "Front: [image URL or description] | Back: [name/term for the image]"}'
  };

  // Get language-specific prompt
  const languagePrompts = {
    'zh-CN': '你是一位小学老师，请根据以下材料生成' + cardCount + '张' + getModeDisplayName(currentMode) + '。\n\n• 主题：' + topic + '\n• 难度：' + difficulty + '\n• 年级：' + grade + '\n• 时长：' + duration + '\n• 模式：' + getModeDisplayName(currentMode),
    'zh-TW': '你是一位小學老師，請根據以下材料生成' + cardCount + '張' + getModeDisplayName(currentMode) + '。\n\n• 主題：' + topic + '\n• 難度：' + difficulty + '\n• 年級：' + grade + '\n• 時長：' + duration + '\n• 模式：' + getModeDisplayName(currentMode),
    'en': 'You are an elementary school teacher. Please generate ' + cardCount + ' ' + getModeDisplayName(currentMode) + ' based on the following materials.\n\n• Topic: ' + topic + '\n• Difficulty: ' + difficulty + '\n• Grade: ' + grade + '\n• Duration: ' + duration + '\n• Mode: ' + getModeDisplayName(currentMode)
  };
  
  let prompt = languagePrompts[currentPageLanguage];
  
  // Add language information for translation mode
  if (currentMode === 'translation') {
    const translationInfo = {
      'zh-CN': '\n• 起始语言：' + fromLanguage + '\n• 目标语言：' + toLanguage,
      'zh-TW': '\n• 起始語言：' + fromLanguage + '\n• 目標語言：' + toLanguage,
      'en': '\n• From Language: ' + fromLanguage + '\n• To Language: ' + toLanguage
    };
    prompt += translationInfo[currentPageLanguage];
  }
  
  prompt += '\n\n' + modePrompts[currentMode] + '\n\n请严格按照格式输出，每张卡片用换行分隔。对于多选题模式，请确保问题在第一行，每个选项（A、B、C、D）在单独的行上，只有正确答案在背面。\n\n材料：\n' + textContent;

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer sk-816d9a802e5f4c8ab73459a40791d7db",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { 
            role: "system", 
            content: currentPageLanguage === 'en' 
              ? "You are a professional teaching assistant, skilled at creating flash cards suitable for elementary school students"
              : currentPageLanguage === 'zh-TW'
              ? "你是專業的教師助理，善於製作適合小學生的flash cards"
              : "你是专业的教师助理，善于制作适合小学生的flash cards"
          },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const t = translations[currentPageLanguage];
    const md = data.choices[0]?.message?.content || '❌ ' + t.noCardsGenerated;
    resultDiv.dataset.raw = md;
    
    // Parse flashcards
    parseFlashcards(md);
    
    // Display flashcards in interactive format
    displayGeneratedFlashcards();
  } catch (error) {
    const t = translations[currentPageLanguage];
    resultDiv.innerHTML = '❌ ' + t.errorGenerating + ' ' + error.message;
  }
}

function getModeDisplayName(mode) {
  const names = {
    'zh-CN': {
      definition: '定义模式',
      translation: '翻译模式',
      'multiple-choice': '多选题模式',
      'fill-blank': '填空题模式',
      'image-based': '图片模式'
    },
    'zh-TW': {
      definition: '定義模式',
      translation: '翻譯模式',
      'multiple-choice': '多選題模式',
      'fill-blank': '填空題模式',
      'image-based': '圖片模式'
    },
    'en': {
      definition: 'Definition Mode',
      translation: 'Translation Mode',
      'multiple-choice': 'Multiple Choice Mode',
      'fill-blank': 'Fill in the Blank Mode',
      'image-based': 'Image-Based Mode'
    }
  };
  return names[currentPageLanguage][mode] || mode;
}

function parseFlashcards(content) {
  flashcards = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // 优先处理 Front: ... | Back: ... 格式
    if (line.includes('Front:') && line.includes('Back:')) {
      const frontMatch = line.match(/Front:\s*(.*?)\s*\|\s*Back:/);
      const backMatch = line.match(/Back:\s*(.*)$/);
      if (frontMatch && backMatch) {
        const front = frontMatch[1].trim();
        const back = backMatch[1].trim();
        flashcards.push({ front, back });
        continue;
      }
    }
    // 其它格式保留原有逻辑
    if (line.includes('Front:')) {
      const firstLine = line.replace('Front:', '').trim();
      const frontLines = [firstLine];
      while (i + 1 < lines.length && !lines[i + 1].includes('| Back:')) {
        i++;
        frontLines.push(lines[i].trim());
      }
      const backLine = lines[i + 1] || '';
      const backText = backLine.split('Back:')[1]?.trim() || '';
      const back = currentMode === 'multiple-choice' ? '✅ ' + backText : backText;
      const front = frontLines.join('\n');
      flashcards.push({ front, back });
    }
  }
  totalCards = flashcards.length;
  if (totalCards > 0) {
    console.log('Parsed ' + totalCards + ' flashcards');
  } else {
    console.log('No flashcards parsed. Content might not match expected format.');
    console.log('Content was:', content);
  }
}

function displayGeneratedFlashcards() {
  const resultDiv = document.getElementById('result');
  if (flashcards.length === 0) {
    const t = translations[currentPageLanguage];
    resultDiv.innerHTML = '<div class="loading">' + t.noCardsGenerated + '</div>';
    return;
  }
  const t = translations[currentPageLanguage];
  let html = '<div class="generated-flashcards-container">' +
    '<h3>' + t.generatedCards + ' (' + flashcards.length + ' cards)</h3>';
  // Add language info for translation mode
  if (currentMode === 'translation') {
    const fromLanguage = document.getElementById('fromLanguage').value;
    const toLanguage = document.getElementById('toLanguage').value;
    html += '<div> - ' + fromLanguage + ' → ' + toLanguage + '</div>';
  }
  html += '<div class="generated-flashcards-grid">';
  flashcards.forEach((card, index) => {
    const isImageUrl = isImageLink(card.front);
    let frontContent = isImageUrl ?
      '<img src="' + card.front + '" alt="Image" style="max-width: 100%; max-height: 200px; object-fit: contain;">' :
      escapeHtml(card.front);
    if (currentMode === 'multiple-choice') {
      // 统一处理：先尝试用换行分割，再用正则提取
      let question = '';
      let options = [];
      const lines = card.front.split('\n');
      question = lines[0].trim();
      options = lines.slice(1).filter(line => line.trim());
      // 如果没有分割出选项，再用正则提取
      if (options.length === 0) {
        const optionMatch = card.front.match(/A\)[^A-D]*B\)[^A-D]*C\)[^A-D]*D\)[^A-D]*/);
        if (optionMatch) {
          const optionsText = optionMatch[0];
          options = optionsText.match(/[A-D]\)[^A-D]*/g) || [];
        }
      }
      // 直接用 <div> 列出所有选项，不加 .mc-option
      frontContent = '<div class="mc-question">' + escapeHtml(question) + '</div>' +
        '<div class="mc-options-no-border">' +
        options.map(option => '<div>' + escapeHtml(option) + '</div>').join('') +
        '</div>';
    }
    html += '<div class="generated-flashcard" onclick="flipGeneratedCard(this)">' +
      '<div class="generated-flashcard-inner">' +
      '<div class="generated-front">' +
      '<div class="card-number">#' + (index + 1) + '</div>' +
      '<div class="card-content">' + frontContent + '</div>' +
      '</div>' +
      '<div class="generated-back">' +
      '<div class="card-number">#' + (index + 1) + '</div>' +
      '<div class="card-content">' + escapeHtml(card.back) + '</div>' +
      '</div>' +
      '</div>' +
      '</div>';
  });
  html += '</div>' +
    '<div class="generated-instructions">' +
    '<p>' + t.clickToFlip + '</p>' +
    '<div class="generated-controls">' +
    '<button class="btn btn-secondary" onclick="flipAllGeneratedCards()">🔄 ' + t.flipAll + '</button>' +
    '<button class="btn btn-primary" onclick="resetAllGeneratedCards()">🔄 ' + t.resetAll + '</button>' +
    '</div>' +
    '</div>' +
    '</div>';
  resultDiv.innerHTML = html;
}

function flipGeneratedCard(card) {
  card.classList.toggle('flipped');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  // Convert newlines to <br> tags for proper HTML display
  return div.innerHTML.replace(/\n/g, '<br>');
}

function isImageLink(text) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  const urlPattern = /^https?:\/\/.+/i;
  
  // Check if it's a URL and has image extension
  if (urlPattern.test(text)) {
    const lowerText = text.toLowerCase();
    return imageExtensions.some(ext => lowerText.includes(ext));
  }
  
  return false;
}

function validateLanguageSelection() {
  const fromLanguage = document.getElementById('fromLanguage').value;
  const toLanguage = document.getElementById('toLanguage').value;
  
  if (fromLanguage === toLanguage) {
    const t = translations[currentPageLanguage];
    alert(t.languageWarning);
    // Reset to different languages
    if (fromLanguage === 'English') {
      document.getElementById('toLanguage').value = 'Simplified Chinese';
    } else if (fromLanguage === 'Simplified Chinese') {
      document.getElementById('toLanguage').value = 'Traditional Chinese';
    } else if (fromLanguage === 'Traditional Chinese') {
      document.getElementById('toLanguage').value = 'Simplified Chinese';
    } else {
      document.getElementById('toLanguage').value = 'English';
    }
  }
}

function flipAllGeneratedCards() {
  const cards = document.querySelectorAll('.generated-flashcard');
  cards.forEach(card => {
    card.classList.add('flipped');
  });
}

function resetAllGeneratedCards() {
  const cards = document.querySelectorAll('.generated-flashcard');
  cards.forEach(card => {
    card.classList.remove('flipped');
  });
}

function startFlashcardMode() {
  if (flashcards.length === 0) {
    const t = translations[currentPageLanguage];
    alert(t.noCardsAvailable);
    return;
  }
  currentCardIndex = 0;
  correctAnswers = 0;
  document.getElementById('flashcardContainer').style.display = 'block';
  document.getElementById('resultSection').style.display = 'none';
  // 进入全屏
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  }
  // 添加返回按钮（如果不存在）
  let backBtn = document.getElementById('flashcardBackButton');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'flashcardBackButton';
    backBtn.className = 'btn btn-secondary';
    backBtn.style.position = 'absolute';
    backBtn.style.top = '24px';
    backBtn.style.left = '24px';
    backBtn.style.zIndex = '1000';
    backBtn.textContent = '← 返回';
    backBtn.onclick = function() {
      // 退出全屏
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
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
  
  // Handle image display for image-based mode
  if (currentMode === 'image-based' && isImageLink(card.front)) {
    document.getElementById('cardFront').innerHTML = '<img src="' + card.front + '" alt="Image" style="max-width: 100%; max-height: 300px; object-fit: contain;">';
  } else if (currentMode === 'multiple-choice') {
    // 统一处理：先尝试用换行分割，再用正则提取
    let question = '';
    let options = [];
    const lines = card.front.split('\n');
    question = lines[0].trim();
    options = lines.slice(1).filter(line => line.trim());
    // 如果没有分割出选项，再用正则提取
    if (options.length === 0) {
      const optionMatch = card.front.match(/A\)[^A-D]*B\)[^A-D]*C\)[^A-D]*D\)[^A-D]*/);
      if (optionMatch) {
        const optionsText = optionMatch[0];
        options = optionsText.match(/[A-D]\)[^A-D]*/g) || [];
      }
    }
    // 直接用 <div> 列出所有选项，不加 .mc-option
    const frontContent =
      '<div class="mc-question">' + escapeHtml(question) + '</div>' +
      '<div class="mc-options-no-border">' +
      options.map(option => '<div>' + escapeHtml(option) + '</div>').join('') +
      '</div>';
    document.getElementById('cardFront').innerHTML = frontContent;
  } else {
    document.getElementById('cardFront').textContent = card.front;
  }
  
  document.getElementById('cardBack').textContent = card.back;
  document.getElementById('cardCounter').textContent = (currentCardIndex + 1) + ' / ' + totalCards;
  
  const progress = ((currentCardIndex + 1) / totalCards) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
  
  // Reset card flip
  document.getElementById('flashcard').classList.remove('flipped');
}

function flipCard() {
  document.getElementById('flashcard').classList.toggle('flipped');
}

function nextCard() {
  if (currentCardIndex < totalCards - 1) {
    currentCardIndex++;
    showCurrentCard();
  }
}

function previousCard() {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    showCurrentCard();
  }
}

function markAsCorrect() {
  correctAnswers++;
  nextCard();
}

function markAsIncorrect() {
  nextCard();
}

function shuffleCards() {
  for (let i = flashcards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
  }
  currentCardIndex = 0;
  showCurrentCard();
}

function amendContent() {
  const generatedContainer = document.querySelector('.generated-flashcards-container');
  if (!generatedContainer) return;
  
  // Toggle edit mode
  const isEditMode = generatedContainer.classList.contains('edit-mode');
  
  if (!isEditMode) {
    // Enter edit mode
    generatedContainer.classList.add('edit-mode');
    document.getElementById('amendButton').textContent = '💾 Save Changes';
    
    // Make all flashcard content editable
    const flashcards = generatedContainer.querySelectorAll('.generated-flashcard');
    flashcards.forEach((card, index) => {
      const frontContent = card.querySelector('.generated-front .card-content');
      const backContent = card.querySelector('.generated-back .card-content');
      
      if (frontContent) {
        const originalText = frontContent.textContent;
        frontContent.innerHTML = '<textarea class="edit-textarea front-edit" data-index="' + index + '" data-side="front">' + originalText + '</textarea>';
      }
      
      if (backContent) {
        const originalText = backContent.textContent;
        backContent.innerHTML = '<textarea class="edit-textarea back-edit" data-index="' + index + '" data-side="back">' + originalText + '</textarea>';
      }
    });
  } else {
    // Save changes and exit edit mode
    generatedContainer.classList.remove('edit-mode');
    document.getElementById('amendButton').textContent = '📝 Amend';
    
    // Collect all edited content
    const editedFlashcards = [];
    const flashcards = generatedContainer.querySelectorAll('.generated-flashcard');
    
    flashcards.forEach((card, index) => {
      const frontTextarea = card.querySelector('.front-edit');
      const backTextarea = card.querySelector('.back-edit');
      
      const frontContent = frontTextarea ? frontTextarea.value : '';
      const backContent = backTextarea ? backTextarea.value : '';
      
      editedFlashcards.push({
        front: frontContent,
        back: backContent
      });
      
      // Restore normal display
      if (frontTextarea) {
        frontTextarea.parentElement.innerHTML = escapeHtml(frontContent);
      }
      if (backTextarea) {
        backTextarea.parentElement.innerHTML = escapeHtml(backContent);
      }
    });
    
    // Update the global flashcards array
    window.flashcards = editedFlashcards;
    
    // Update the raw content for export
    const rawContent = editedFlashcards.map(card => {
      return 'Front: ' + card.front + '\nBack: ' + card.back + '\n---';
    }).join('\n');
    document.getElementById('result').dataset.raw = rawContent;
    
    // Show success message
    const t = translations[currentPageLanguage];
    alert(t.changesSaved || 'Changes saved successfully!');
  }
}

function downloadFile(type) {
  if (type === 'ppt') {
    generatePPT();
  } else {
    const content = document.getElementById('result').dataset.raw;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'flashcards.docx.md';
    a.click();
  }
}

function generatePPT() {
  if (flashcards.length === 0) {
    const t = translations[currentPageLanguage];
    alert(t.noCardsToExport);
    return;
  }

  // Check if PptxGenJS is available
  if (typeof PptxGenJS === 'undefined') {
    // Fallback: Generate HTML presentation
    generateHTMLPresentation();
    return;
  }

  // Show loading message
  const resultDiv = document.getElementById('result');
  const originalContent = resultDiv.innerHTML;
  const t = translations[currentPageLanguage];
  resultDiv.innerHTML = '<div class="loading">' + t.generatingPPT + '</div>';

  try {
    // Create PPTX using PptxGenJS
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.author = 'Flashcard Generator';
    pptx.company = 'Educational Tools';
    pptx.title = document.getElementById('topic').value || 'Flashcards';
    pptx.subject = 'Generated Flashcards';
    
    // Add title slide with background
    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: 'F8F9FA' };
    
    // Add title
    titleSlide.addText('🎯 Flashcards', {
      x: 1, y: 1, w: 8, h: 2,
      fontSize: 48,
      bold: true,
      color: '363636',
      align: 'center',
      fontFace: 'Arial'
    });
    
    const topic = document.getElementById('topic').value;
    if (topic) {
      titleSlide.addText('📚 Topic: ' + topic, {
        x: 1, y: 3, w: 8, h: 1,
        fontSize: 28,
        color: '666666',
        align: 'center',
        fontFace: 'Arial'
      });
    }
    
    const cardCount = flashcards.length;
    titleSlide.addText('📊 Total Cards: ' + cardCount, {
      x: 1, y: 4, w: 8, h: 1,
      fontSize: 22,
      color: '888888',
      align: 'center',
      fontFace: 'Arial'
    });
    
    // Add language info for translation mode
    if (currentMode === 'translation') {
      const fromLanguage = document.getElementById('fromLanguage').value;
      const toLanguage = document.getElementById('toLanguage').value;
      titleSlide.addText('🌍 ' + fromLanguage + ' → ' + toLanguage, {
        x: 1, y: 5, w: 8, h: 1,
        fontSize: 24,
        color: '0066cc',
        align: 'center',
        bold: true,
        fontFace: 'Arial'
      });
    }
    
    // Add mode info
    titleSlide.addText('🎮 Mode: ' + getModeDisplayName(currentMode), {
      x: 1, y: 6, w: 8, h: 1,
      fontSize: 20,
      color: '009900',
      align: 'center',
      fontFace: 'Arial'
    });
    
    // Generate slides for each flashcard
    flashcards.forEach((card, index) => {
      // Front slide (Question)
      const frontSlide = pptx.addSlide();
      frontSlide.background = { color: 'FFFFFF' };
      
      // Add slide number and mode
      frontSlide.addText('Card ' + (index + 1) + ' of ' + cardCount + ' | ' + getModeDisplayName(currentMode), {
        x: 0.5, y: 0.2, w: 9, h: 0.5,
        fontSize: 12,
        color: '999999',
        align: 'center',
        fontFace: 'Arial'
      });
      
      // Add decorative line
      frontSlide.addShape('line', {
        x: 0.5, y: 0.8, w: 9, h: 0,
        line: { color: 'E0E0E0', width: 2 }
      });
      
      // Add front content with better styling
      if (currentMode === 'multiple-choice') {
        // Special formatting for multiple choice mode
        const lines = card.front.split('\n');
        const question = lines[0];
        const options = lines.slice(1).filter(line => line.trim());
        
        // If no options found in separate lines, try to extract from the question line
        let extractedOptions = [];
        let questionText = question;
        if (options.length === 0) {
          // Try to extract options from the question line using regex
          const optionMatch = question.match(/(.*?)(A\) .*B\) .*C\) .*D\) .*)/);
          if (optionMatch) {
            questionText = optionMatch[1].trim();
            const optionsText = optionMatch[2];
            const optionParts = optionsText.match(/[A-D]\) [^A-D]*/g);
            if (optionParts) {
              extractedOptions = optionParts;
            }
          }
        }
        
        // Add question
        frontSlide.addText(questionText, {
          x: 0.5, y: 1.5, w: 9, h: 1.5,
          fontSize: 28,
          bold: true,
          color: '363636',
          align: 'center',
          valign: 'middle',
          breakLine: true,
          fontFace: 'Arial',
          shadow: { type: 'outer', color: '000000', blur: 3, offset: 2, angle: 45 }
        });
        
        // Add options (either from separate lines or extracted from question)
        const optionsToShow = options.length > 0 ? options : extractedOptions;
        optionsToShow.forEach((option, optionIndex) => {
          const yPos = 3.5 + (optionIndex * 0.8);
          frontSlide.addText(option, {
            x: 1, y: yPos, w: 8, h: 0.6,
            fontSize: 20,
            color: '666666',
            align: 'left',
            fontFace: 'Arial'
          });
        });
      } else {
        frontSlide.addText(card.front, {
          x: 0.5, y: 2, w: 9, h: 3,
          fontSize: 36,
          bold: true,
          color: '363636',
          align: 'center',
          valign: 'middle',
          breakLine: true,
          fontFace: 'Arial',
          shadow: { type: 'outer', color: '000000', blur: 3, offset: 2, angle: 45 }
        });
      }
      
      // Add instruction
      frontSlide.addText('💡 Click to reveal answer', {
        x: 0.5, y: 6, w: 9, h: 0.5,
        fontSize: 16,
        color: '666666',
        align: 'center',
        italic: true,
        fontFace: 'Arial'
      });
      
      // Back slide (Answer)
      const backSlide = pptx.addSlide();
      backSlide.background = { color: 'F0F8FF' };
      
      // Add slide number and mode
      backSlide.addText('Card ' + (index + 1) + ' of ' + cardCount + ' - Answer | ' + getModeDisplayName(currentMode), {
        x: 0.5, y: 0.2, w: 9, h: 0.5,
        fontSize: 12,
        color: '999999',
        align: 'center',
        fontFace: 'Arial'
      });
      
      // Add decorative line
      backSlide.addShape('line', {
        x: 0.5, y: 0.8, w: 9, h: 0,
        line: { color: 'E0E0E0', width: 2 }
      });
      
      // Add question (smaller, in a box)
      backSlide.addShape('rect', {
        x: 0.5, y: 1, w: 9, h: 1.2,
        fill: { color: 'F5F5F5' },
        line: { color: 'CCCCCC', width: 1 }
      });
      
      backSlide.addText('❓ Question: ' + card.front, {
        x: 0.7, y: 1.1, w: 8.6, h: 1,
        fontSize: 18,
        color: '666666',
        align: 'center',
        italic: true,
        fontFace: 'Arial'
      });
      
      // Add answer with highlight
      backSlide.addShape('rect', {
        x: 0.5, y: 2.5, w: 9, h: 3,
        fill: { color: 'E8F4FD' },
        line: { color: '0066CC', width: 2 },
        shadow: { type: 'outer', color: '000000', blur: 5, offset: 3, angle: 45 }
      });
      
      backSlide.addText('✅ Answer: ' + card.back, {
        x: 0.7, y: 2.7, w: 8.6, h: 2.6,
        fontSize: 32,
        bold: true,
        color: '0066cc',
        align: 'center',
        valign: 'middle',
        breakLine: true,
        fontFace: 'Arial'
      });
      
      // Add separator line
      backSlide.addShape('line', {
        x: 1, y: 2.3, w: 8, h: 0,
        line: { color: '0066CC', width: 3 }
      });
    });
    
    // Add summary slide
    const summarySlide = pptx.addSlide();
    summarySlide.background = { color: 'F8F9FA' };
    
    summarySlide.addText('📋 Summary', {
      x: 1, y: 1, w: 8, h: 1,
      fontSize: 40,
      bold: true,
      color: '363636',
      align: 'center',
      fontFace: 'Arial'
    });
    
    summarySlide.addText('📊 Total Flashcards: ' + cardCount, {
      x: 1, y: 2.5, w: 8, h: 0.5,
      fontSize: 24,
      color: '666666',
      align: 'center',
      fontFace: 'Arial'
    });
    
    summarySlide.addText('🎮 Mode: ' + getModeDisplayName(currentMode), {
      x: 1, y: 3.2, w: 8, h: 0.5,
      fontSize: 20,
      color: '009900',
      align: 'center',
      fontFace: 'Arial'
    });
    
    if (topic) {
      summarySlide.addText('📚 Topic: ' + topic, {
        x: 1, y: 3.9, w: 8, h: 0.5,
        fontSize: 20,
        color: '666666',
        align: 'center',
        fontFace: 'Arial'
      });
    }
    
    summarySlide.addText('Flashcard Generator', {
      x: 1, y: 5, w: 8, h: 0.5,
      fontSize: 16,
      color: '999999',
      align: 'center',
      italic: true,
      fontFace: 'Arial'
    });
    
    // Download the PPTX file
    const fileName = 'flashcards_' + (topic ? topic.replace(/[^a-zA-Z0-9]/g, '_') : 'presentation') + '.pptx';
    pptx.writeFile({ fileName: fileName }).then(() => {
      // Restore original content after successful generation
      resultDiv.innerHTML = originalContent;
      alert('✅ PowerPoint presentation generated successfully!');
    }).catch(error => {
      console.error('Error generating PPT:', error);
      resultDiv.innerHTML = originalContent;
      alert('❌ Error generating PowerPoint presentation. Please try again.');
    });
    
  } catch (error) {
    console.error('Error generating PPT:', error);
    resultDiv.innerHTML = originalContent;
    alert('❌ Error generating PowerPoint presentation. Please try again.');
  }
}

function generateHTMLPresentation() {
  if (flashcards.length === 0) {
    const t = translations[currentPageLanguage];
    alert(t.noCardsToExport);
    return;
  }

  const topic = document.getElementById('topic').value || 'Flashcards';
  const cardCount = flashcards.length;
  
  let html = '';
  html += '<!DOCTYPE html>';
  html += '<html lang="en">';
  html += '<head>';
  html += '<meta charset="UTF-8">';
  html += '<title>' + topic + ' - Flashcards</title>';
  html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
  html += '<style>';
  html += 'body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }';
  html += '.slide { background: white; border-radius: 15px; margin: 20px auto; max-width: 800px; min-height: 500px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); text-align: center; display: none; }';
  html += '.slide.active { display: block; }';
  html += '.title { font-size: 48px; color: #363636; margin-bottom: 20px; }';
  html += '.subtitle { font-size: 24px; color: #666666; margin-bottom: 15px; }';
  html += '.content { font-size: 36px; color: #363636; margin: 40px 0; line-height: 1.4; }';
  html += '.question { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 24px; color: #666666; }';
  html += '.answer { background: #e8f4fd; padding: 20px; border-radius: 10px; margin: 20px 0; font-size: 32px; color: #0066cc; border: 2px solid #0066cc; }';
  html += '.controls { text-align: center; margin: 20px 0; }';
  html += '.btn { padding: 12px 24px; margin: 0 10px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; }';
  html += '.btn-primary { background: #667eea; color: white; }';
  html += '.btn-secondary { background: #6c757d; color: white; }';
  html += '.slide-counter { text-align: center; font-size: 18px; color: #666666; margin: 20px 0; }';
  html += '.mc-question { font-size: 1.3em; font-weight: bold; margin-bottom: 20px; text-align: center; line-height: 1.4; color: #363636; }';
  html += '.mc-options { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 500px; margin: 0 auto; }';
  html += '.mc-option { background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 12px 16px; font-size: 1em; text-align: left; transition: all 0.3s ease; color: #333; }';
  html += '.mc-option:hover { background: #e9ecef; border-color: #667eea; transform: translateX(5px); }';
  html += '</style>';
  html += '</head>';
  html += '<body>';
  html += '<div class="controls">';
  html += '<button class="btn btn-secondary" onclick="previousSlide()">← Previous</button>';
  html += '<button class="btn btn-primary" onclick="nextSlide()">Next →</button>';
  html += '<button class="btn btn-secondary" onclick="toggleFullscreen()">Fullscreen</button>';
  html += '</div>';
  html += '<div class="slide-counter">';
  html += '<span id="slideCounter">1</span> of <span id="totalSlides">1</span>';
  html += '</div>';
  // Add title slide
  html += '<div class="slide active" id="slide-0">';
  html += '<div class="title">🎯 Flashcards</div>';
  html += '<div class="subtitle">' + topic + '</div>';
  html += '<div class="subtitle">📊 Total Cards: ' + cardCount + '</div>';
  html += '<div class="subtitle">🎮 Mode: ' + getModeDisplayName(currentMode) + '</div>';
  html += '</div>';
  // Add language info for translation mode
  if (currentMode === 'translation') {
    const fromLanguage = document.getElementById('fromLanguage').value;
    const toLanguage = document.getElementById('toLanguage').value;
    html += '<div class="slide" id="slide-0-5">';
    html += '<div class="title">🌍 Language Settings</div>';
    html += '<div class="content">' + fromLanguage + ' → ' + toLanguage + '</div>';
    html += '</div>';
  }
  // Add slides for each flashcard
  flashcards.forEach((card, index) => {
    const slideNum = index * 2 + 1;
    // Question slide
    if (currentMode === 'multiple-choice') {
      const lines = card.front.split('\n');
      const question = lines[0];
      const options = lines.slice(1).filter(line => line.trim());
      let extractedOptions = [];
      let questionText = question;
      if (options.length === 0) {
        const optionMatch = question.match(/(.*?)(A\) .*B\) .*C\) .*D\) .*)/);
        if (optionMatch) {
          questionText = optionMatch[1].trim();
          const optionsText = optionMatch[2];
          const optionParts = optionsText.match(/[A-D]\) [^A-D]*/g);
          if (optionParts) {
            extractedOptions = optionParts;
          }
        }
      }
      const optionsToShow = options.length > 0 ? options : extractedOptions;
      html += '<div class="slide" id="slide-' + slideNum + '">';
      html += '<div class="subtitle">Card ' + (index + 1) + ' of ' + cardCount + ' | ' + getModeDisplayName(currentMode) + '</div>';
      html += '<div class="content">';
      html += '<div class="mc-question">' + questionText + '</div>';
      html += '<div class="mc-options">' + optionsToShow.map(option => '<div class="mc-option">' + option + '</div>').join('') + '</div>';
      html += '</div>';
      html += '<div class="subtitle">💡 Click Next to see the answer</div>';
      html += '</div>';
    } else {
      html += '<div class="slide" id="slide-' + slideNum + '">';
      html += '<div class="subtitle">Card ' + (index + 1) + ' of ' + cardCount + ' | ' + getModeDisplayName(currentMode) + '</div>';
      html += '<div class="content">' + card.front + '</div>';
      html += '<div class="subtitle">💡 Click Next to see the answer</div>';
      html += '</div>';
    }
    // Answer slide
    html += '<div class="slide" id="slide-' + (slideNum + 1) + '">';
    html += '<div class="subtitle">Card ' + (index + 1) + ' of ' + cardCount + ' - Answer | ' + getModeDisplayName(currentMode) + '</div>';
    html += '<div class="question">❓ Question: ' + card.front.split('\n')[0] + '</div>';
    html += '<div class="answer">✅ Answer: ' + card.back + '</div>';
    html += '</div>';
  });
  // Add summary slide
  html += '<div class="slide" id="slide-' + (flashcards.length * 2 + 1) + '">';
  html += '<div class="title">📋 Summary</div>';
  html += '<div class="subtitle">📊 Total Flashcards: ' + cardCount + '</div>';
  html += '<div class="subtitle">🎮 Mode: ' + getModeDisplayName(currentMode) + '</div>';
  html += '<div class="subtitle">📚 Topic: ' + topic + '</div>';
  html += '<div class="subtitle">🎯 Flashcard Generator</div>';
  html += '</div>';
  html += '</body>';
  html += '<script>';
  html += 'let currentSlide = 0;';
  html += 'const slides = document.querySelectorAll(".slide");';
  html += 'const totalSlides = slides.length;';
  html += 'document.getElementById("totalSlides").textContent = totalSlides;';
  html += 'function showSlide(n) {';
  html += 'slides.forEach(slide => slide.classList.remove("active"));';
  html += 'slides[n].classList.add("active");';
  html += 'document.getElementById("slideCounter").textContent = n + 1;';
  html += '}';
  html += 'function nextSlide() {';
  html += 'if (currentSlide < totalSlides - 1) { currentSlide++; showSlide(currentSlide); }';
  html += '}';
  html += 'function previousSlide() {';
  html += 'if (currentSlide > 0) { currentSlide--; showSlide(currentSlide); }';
  html += '}';
  html += 'function toggleFullscreen() {';
  html += 'if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); } else { document.exitFullscreen(); }';
  html += '}';
  html += 'document.addEventListener("keydown", function(e) {';
  html += 'if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); nextSlide(); } else if (e.key === "ArrowLeft") { e.preventDefault(); previousSlide(); } else if (e.key === "F11") { e.preventDefault(); toggleFullscreen(); }';
  html += '});';
  html += '</script>';
  html += '</html>';
  
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'flashcards_' + topic.replace(/[^a-zA-Z0-9]/g, '_') + '.html';
  a.click();
  
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = originalContent;
  const t = translations[currentPageLanguage];
  alert(t.htmlPresentationGenerated);
}

function createSampleFlashcards() {
  const samples = {
    definition: [
      { front: "Photosynthesis", back: "The process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water." },
      { front: "Mitochondria", back: "The powerhouse of the cell, responsible for producing energy through cellular respiration." },
      { front: "Ecosystem", back: "A community of living organisms and their physical environment interacting as a system." }
    ],
    translation: [
      { front: "Hello", back: "你好" },
      { front: "Good morning", back: "早上好" },
      { front: "Thank you", back: "谢谢" }
    ],
    'multiple-choice': [
      { front: "What is the capital of France?\nA) Florida\nB) Paris\nC) Texas\nD) Narnia", back: "✅ B) Paris" },
      { front: "Which planet is closest to the Sun?\nA) Earth\nB) Venus\nC) Mercury\nD) Mars", back: "✅ C) Mercury" }
    ],
    'fill-blank': [
      { front: "The powerhouse of the cell is the _____.", back: "Mitochondrion" },
      { front: "Water is made up of hydrogen and _____.", back: "Oxygen" }
    ],
    'image-based': [
      { front: "https://images.unsplash.com/photo-1557050543-4d8f8e07c3b2?w=400", back: "Elephant" },
      { front: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", back: "Mountain" },
      { front: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", back: "Sun" },
      { front: "A bright yellow star in the sky during the day", back: "Sun" }
    ]
  };
  
  // For translation mode, create samples based on selected languages
  if (currentMode === 'translation') {
    const fromLanguage = document.getElementById('fromLanguage').value;
    const toLanguage = document.getElementById('toLanguage').value;
    
    // Create language-specific samples
    const languageSamples = {
      'English-Simplified Chinese': [
        { front: "Hello", back: "你好" },
        { front: "Good morning", back: "早上好" },
        { front: "Thank you", back: "谢谢" }
      ],
      'Simplified Chinese-English': [
        { front: "你好", back: "Hello" },
        { front: "早上好", back: "Good morning" },
        { front: "谢谢", back: "Thank you" }
      ],
      'English-Traditional Chinese': [
        { front: "Hello", back: "你好" },
        { front: "Good morning", back: "早上好" },
        { front: "Thank you", back: "謝謝" }
      ],
      'Traditional Chinese-English': [
        { front: "你好", back: "Hello" },
        { front: "早上好", back: "Good morning" },
        { front: "謝謝", back: "Thank you" }
      ],
      'Simplified Chinese-Traditional Chinese': [
        { front: "你好", back: "你好" },
        { front: "早上好", back: "早上好" },
        { front: "谢谢", back: "謝謝" },
        { front: "学习", back: "學習" },
        { front: "计算机", back: "計算機" }
      ],
      'Traditional Chinese-Simplified Chinese': [
        { front: "你好", back: "你好" },
        { front: "早上好", back: "早上好" },
        { front: "謝謝", back: "谢谢" },
        { front: "學習", back: "学习" },
        { front: "計算機", back: "计算机" }
      ],
      'English-Spanish': [
        { front: "Hello", back: "Hola" },
        { front: "Good morning", back: "Buenos días" },
        { front: "Thank you", back: "Gracias" }
      ],
      'Spanish-English': [
        { front: "Hola", back: "Hello" },
        { front: "Buenos días", back: "Good morning" },
        { front: "Gracias", back: "Thank you" }
      ],
      'English-French': [
        { front: "Hello", back: "Bonjour" },
        { front: "Good morning", back: "Bonjour" },
        { front: "Thank you", back: "Merci" }
      ],
      'French-English': [
        { front: "Bonjour", back: "Hello" },
        { front: "Merci", back: "Thank you" },
        { front: "Au revoir", back: "Goodbye" }
      ]
    };
    
    const languageKey = fromLanguage + '-' + toLanguage;
    if (languageSamples[languageKey]) {
      return languageSamples[languageKey];
    }
  }
  
  return samples[currentMode] || samples.definition;
}

function loadSampleFlashcards() {
  flashcards = createSampleFlashcards();
  totalCards = flashcards.length;
  currentCardIndex = 0;
  correctAnswers = 0;
  
  document.getElementById('flashcardContainer').style.display = 'block';
  document.getElementById('resultSection').style.display = 'none';
  showCurrentCard();
}

// Keyboard navigation
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
        e.preventDefault();
        flipCard();
        break;
    }
  }
});

// Export functions for different formats
function exportToCSV() {
  if (flashcards.length === 0) {
    const t = translations[currentPageLanguage];
    alert(t.noCardsToExport);
    return;
  }
  
  let csv = 'Front,Back\n';
  flashcards.forEach(card => {
    csv += '"' + card.front.replace(/"/g, '""') + '","' + card.back.replace(/"/g, '""') + '"\n';
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'flashcards.csv';
  a.click();
}

function exportToJSON() {
  if (flashcards.length === 0) {
    const t = translations[currentPageLanguage];
    alert(t.noCardsToExport);
    return;
  }
  
  const data = {
    mode: currentMode,
    topic: document.getElementById('topic').value,
    grade: document.getElementById('grade').value,
    difficulty: document.querySelector('input[name="difficulty"]:checked').value,
    flashcards: flashcards,
    generatedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'flashcards.json';
  a.click();
}  