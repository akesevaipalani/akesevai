// ============================================================================
// AK E-SEVAI PHOTO & DOCUMENT TOOLS - MASTER METADATA & CONFIGURATION
// Covers 19 Dedicated Tool URLs + 1 Master Content Hub (/photo-tools)
// ============================================================================

export const PHOTO_TOOLS_CATALOG = [
  // 1. PASSPORT SIZE PHOTO MAKER
  {
    id: 'passport-size-photo',
    path: '/tools/passport-size-photo',
    category: 'passport',
    categoryTitle: 'Passport & Identity Photos',
    categoryTitleTa: 'பாஸ்போர்ட் & அடையாளப் படங்கள்',
    title: 'Passport Size Photo Maker Online (3.5x4.5 cm) – Free Photo Studio | AK e-Sevai',
    titleTa: 'பாஸ்போர்ட் சைஸ் போட்டோ மேக்கர் ஆன்லைன் (3.5x4.5 cm) | AK e-Sevai',
    description: 'Create official 3.5 x 4.5 cm (35 x 45 mm) passport size photos online. Generate 4x6 (8 copies) and A4 (30+ copies) printable sheets with borders, name & date stamps. Free & 100% private.',
    descriptionTa: 'அரசு அங்கீகரிக்கப்பட்ட 3.5 x 4.5 cm பாஸ்போர்ட் சைஸ் போட்டோக்களை ஆன்லைனில் உருவாக்குங்கள். 4x6 (8 போட்டோ) மற்றும் A4 (30+ போட்டோ) அச்சிடும் தாள்கள், பார்டர் மற்றும் பெயர்/தேதி முத்திரையுடன் இலவசமாக தயார் செய்யுங்கள்.',
    keywords: 'passport size photo maker, passport size photo online, passport size photo 35x45, passport photo 3.5 x 4.5 cm, passport size photo செய்ய, passport size photo online maker, passport sheet maker, akesevai passport photo',
    mode: 'passport',
    icon: 'Camera',
    badge: 'Official 3.5 × 4.5 cm',
    badgeTa: 'அரசு 3.5 × 4.5 செ.மீ',
    shortDesc: 'Create single passport photos or 4x6 / A4 printable multi-photo sheets with border and name stamp.',
    shortDescTa: 'பாஸ்போர்ட் போட்டோ அல்லது 4x6 / A4 அச்சிடும் தாள்களை பார்டர் மற்றும் பெயர்/தேதியுடன் உருவாக்குங்கள்.',
    defaultTargetKb: 50,
    presetSizes: [
      { label: 'Standard Passport (3.5 × 4.5 cm / 350×450 px)', w: 350, h: 450, targetKb: 50, name: 'Standard Passport' },
      { label: 'TNPSC Photo Stamp (350 × 450 px with Name & Date)', w: 350, h: 450, targetKb: 50, hasNameStamp: true, name: 'TNPSC Stamp' },
      { label: 'SSC / Central Govt (200 × 230 px)', w: 200, h: 230, targetKb: 20, name: 'SSC Central' },
      { label: 'US / Visa (2 × 2 inch / 600×600 px)', w: 600, h: 600, targetKb: 100, name: 'Visa 2x2' }
    ],
    faqs: [
      {
        q: 'What is the standard passport size photo dimension in India?',
        qTa: 'இந்தியாவில் அதிகாரப்பூர்வ பாஸ்போர்ட் போட்டோவின் அளவு என்ன?',
        a: 'The standard passport size photo dimension in India is 3.5 cm (width) x 4.5 cm (height) or 35 mm x 45 mm, corresponding to 413 x 531 pixels at 300 DPI.',
        aTa: 'இந்தியாவில் வழக்கமான பாஸ்போர்ட் போட்டோவின் அளவு 3.5 செ.மீ (அகலம்) x 4.5 செ.மீ (உயரம்) அல்லது 35 மி.மீ x 45 மி.மீ (413 x 531 பிக்சல்கள், 300 DPI) ஆகும்.'
      },
      {
        q: 'How many photos can I print on a 4x6 or A4 photo sheet?',
        qTa: '4x6 அல்லது A4 தாளில் எத்தனை பாஸ்போர்ட் போட்டோக்களை அச்சிடலாம்?',
        a: 'Our tool automatically arranges 8 photos on a 4x6 inch (Maxi) sheet, and up to 32–36 photos on an A4 sheet with proper cutting guidelines and borders.',
        aTa: 'எங்கள் கருவி மூலம் 4x6 தாளில் 8 போட்டோக்களையும், A4 தாளில் 32 முதல் 36 போட்டோக்களையும் வெட்டுவதற்கான பார்டருடன் எளிதாக அச்சிடலாம்.'
      },
      {
        q: 'Is my photo uploaded to any external server?',
        qTa: 'எனது புகைப்படம் ஏதேனும் வெளி சர்வரில் பதிவேற்றப்படுகிறதா?',
        a: 'No. All processing happens 100% locally inside your web browser using HTML5 Canvas. Your sensitive personal photos never leave your device.',
        aTa: 'இல்லை. அனைத்து செயல்பாடுகளும் உங்கள் பிரவுசரிலேயே HTML5 Canvas மூலம் பாதுகாப்பாக நடைபெறுகிறது. உங்கள் படம் எந்த சர்வர்க்கும் அனுப்பப்படாது.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Photo', titleTa: 'புகைப்படத்தை பதிவேற்றவும்', text: 'Select a photo from your mobile gallery, camera, or computer.', textTa: 'உங்கள் மொபைல் கேலரி அல்லது கம்ப்யூட்டரிலிருந்து போட்டோவை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Adjust & Position', titleTa: 'அளவை சரிசெய்யவும்', text: 'Zoom, center face, select paper type (Single / 4x6 / A4), and add border or name/date stamp.', textTa: 'முகத்தை மையப்படுத்தி, தாளின் வகையைத் தேர்வு செய்து, பெயர்/தேதி முத்திரை சேர்க்கவும்.' },
      { step: 3, title: 'Download & Print', titleTa: 'பதிவிறக்கி அச்சிடவும்', text: 'Click Download to save ultra-high resolution JPG ready for studio printing or online upload.', textTa: 'பதிவிறக்கு பட்டனை அழுத்தி உடனே ஸ்டுடியோவில் அச்சிடவோ இணையத்தில் சமர்ப்பிக்கவோ சேமிக்கவும்.' }
    ],
    relatedTools: ['passport-photo-resize', 'photo-crop', 'photo-compress-50kb', 'photo-background-change', 'jpg-to-pdf']
  },

  // 2. PASSPORT PHOTO RESIZE
  {
    id: 'passport-photo-resize',
    path: '/tools/passport-photo-resize',
    category: 'passport',
    categoryTitle: 'Passport & Identity Photos',
    categoryTitleTa: 'பாஸ்போர்ட் & அடையாளப் படங்கள்',
    title: 'Passport Photo Resize Online (3.5cm x 4.5cm / 350x450px) | AK e-Sevai',
    titleTa: 'பாஸ்போர்ட் போட்டோ ரீசைஸ் ஆன்லைன் (3.5cm x 4.5cm) | AK e-Sevai',
    description: 'Resize photos to exact passport dimensions (3.5 x 4.5 cm, 200x230 px, 350x450 px) for online applications, TNPSC, SSC, UPSC, IBPS and government job forms.',
    descriptionTa: 'அரசுத் தேர்வுகள் மற்றும் ஆன்லைன் விண்ணப்பங்களுக்காக புகைப்படங்களை 3.5 x 4.5 செ.மீ, 200x230 பிக்சல் அல்லது 350x450 பிக்சல் அளவிற்கு உடனடியாக ரீசைஸ் செய்யுங்கள்.',
    keywords: 'passport photo resize, passport photo resize online, resize photo for passport, government exam photo resize, passport photo resize செய்ய, photo resize online',
    mode: 'passport-resize',
    icon: 'SlidersHorizontal',
    badge: 'Exam Dimension Resizer',
    badgeTa: 'தேர்வு அளவு ரீசைசர்',
    shortDesc: 'Resize photos to standard 3.5cm x 4.5cm, 200x230px or custom dimensions with exact KB control.',
    shortDescTa: 'புகைப்படங்களை 3.5x4.5 செ.மீ அல்லது 200x230 பிக்சல் அளவிற்கு துல்லியமாக ரீசைஸ் செய்யுங்கள்.',
    defaultTargetKb: 50,
    presetSizes: [
      { label: '3.5 cm × 4.5 cm (Passport standard)', w: 350, h: 450, targetKb: 50, name: '3.5x4.5cm' },
      { label: '200 × 230 px (SSC / Central Govt)', w: 200, h: 230, targetKb: 20, name: 'SSC 200x230' },
      { label: '350 × 350 px (UPSC Square)', w: 350, h: 350, targetKb: 40, name: 'UPSC 350x350' },
      { label: '200 × 100 px (Government Signature)', w: 200, h: 100, targetKb: 20, name: 'Signature 200x100' }
    ],
    faqs: [
      {
        q: 'Which photo dimension is needed for Tamil Nadu e-Sevai applications?',
        qTa: 'தமிழ்நாடு இ-சேவை விண்ணப்பங்களுக்கு என்ன அளவு போட்டோ தேவை?',
        a: 'Most Tamil Nadu e-Sevai certificates (Income, Community, Nativity) require a passport photo under 50 KB, typically 200x230 px or 350x450 px. Always check the official notification before uploading.',
        aTa: 'வருமானம், சாதி போன்ற இ-சேவை சான்றிதழ்களுக்கு 50 KB-க்குள் இருக்கும் 200x230 அல்லது 350x450 பிக்சல் போட்டோ போதுமானது. பதிவேற்றுவதற்கு முன் அதிகாரப்பூர்வ அறிவிப்பை சரிபார்க்கவும்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Select Image', titleTa: 'படத்தைத் தேர்ந்தெடுக்கவும்', text: 'Upload any photo from your device.', textTa: 'உங்கள் சாதனத்திலிருந்து புகைப்படத்தை பதிவேற்றவும்.' },
      { step: 2, title: 'Pick Dimensions', titleTa: 'அளவைத் தேர்ந்தெடுக்கவும்', text: 'Select 3.5x4.5 cm or enter custom pixel width and height.', textTa: '3.5x4.5 செ.மீ அல்லது தேவையான பிக்சல் அளவை தேர்ந்தெடுக்கவும்.' },
      { step: 3, title: 'Download Resized Photo', titleTa: 'ரீசைஸ் செய்த படத்தை பதிவிறக்கவும்', text: 'Download the resized photo with exact dimensions and target file size.', textTa: 'துல்லியமான அளவுடன் புதிய படத்தை உடனே பதிவிறக்கவும்.' }
    ],
    relatedTools: ['passport-size-photo', 'photo-crop', 'photo-compress-50kb', 'photo-resizer', 'photo-to-jpg']
  },

  // 3. PHOTO CROP
  {
    id: 'photo-crop',
    path: '/tools/photo-crop',
    category: 'crop-resize',
    categoryTitle: 'Crop & Resize Tools',
    categoryTitleTa: 'க்ராப் & ரீசைஸ் கருவிகள்',
    title: 'Photo Crop Online – Free Image Cropper Tool | AK e-Sevai',
    titleTa: 'போட்டோ க்ராப் ஆன்லைன் – இலவச இமேஜ் க்ராப்பர் | AK e-Sevai',
    description: 'Crop photos online with precise aspect ratios (1:1 Square, 3.5:4.5 Passport, 4:3, 16:9, Signature). Zoom, rotate, drag and crop photos with zero quality loss.',
    descriptionTa: 'புகைப்படங்களை 1:1 சதுரம், 3.5:4.5 பாஸ்போர்ட், 4:3, 16:9 அல்லது கையொப்ப அளவுக்கு துல்லியமாக வெட்டி க்ராப் செய்யுங்கள். மொபைல் மற்றும் கம்ப்யூட்டரில் எளிதாக பயன்படுத்தலாம்.',
    keywords: 'photo crop online, crop photo online, image cropper, crop picture online, photo crop செய்ய, passport photo crop செய்ய, online photo cropper',
    mode: 'crop',
    icon: 'Crop',
    badge: 'Smart Ratio Cropper',
    badgeTa: 'விகித க்ராப்பர்',
    shortDesc: 'Crop photos to square 1:1, passport 3.5:4.5, widescreen 16:9 or signature rectangle.',
    shortDescTa: 'போட்டோக்களை பாஸ்போர்ட் அல்லது கையொப்ப அளவுக்கு விரும்பியவாறு வெட்டுங்கள்.',
    defaultTargetKb: 80,
    presetSizes: [
      { label: '3.5 : 4.5 (Passport Aspect Ratio)', aspect: 3.5 / 4.5, name: 'Passport 3.5:4.5' },
      { label: '1 : 1 (Square / Avatar / Profile)', aspect: 1, name: 'Square 1:1' },
      { label: '2 : 1 (Signature Crop)', aspect: 2 / 1, name: 'Signature 2:1' },
      { label: '4 : 3 (Standard Photo)', aspect: 4 / 3, name: 'Standard 4:3' },
      { label: '16 : 9 (Widescreen / Header)', aspect: 16 / 9, name: 'Widescreen 16:9' }
    ],
    faqs: [
      {
        q: 'Can I crop signatures for government exam forms?',
        qTa: 'அரசுத் தேர்வுக்கான கையொப்பப் படத்தை க்ராப் செய்ய முடியுமா?',
        a: 'Yes, select the 2:1 Signature preset, zoom in on your signature on white paper, and crop cleanly under 20 KB.',
        aTa: 'ஆம், 2:1 Signature தேர்வை பயன்படுத்தி வெள்ளை தாளில் உள்ள கையொப்பத்தை மட்டும் துல்லியமாக 20 KB-க்குள் க்ராப் செய்யலாம்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Image', titleTa: 'படத்தை பதிவேற்றவும்', text: 'Upload the photo you want to crop.', textTa: 'நீங்கள் வெட்ட விரும்பும் படத்தை பதிவேற்றவும்.' },
      { step: 2, title: 'Adjust Crop Box', titleTa: 'க்ராப் பெட்டியை நகர்த்தவும்', text: 'Drag the crop box or select an aspect ratio preset.', textTa: 'தேவையான அளவை தேர்வு செய்து பெட்டியை நகர்த்தவும்.' },
      { step: 3, title: 'Apply & Save', titleTa: 'சேமித்து பதிவிறக்கவும்', text: 'Click Crop & Download to get the clean output image.', textTa: 'க்ராப் செய்து புதிய படத்தை உடனடியாக பதிவிறக்கவும்.' }
    ],
    relatedTools: ['passport-size-photo', 'photo-resizer', 'photo-compress', 'photo-editor', 'photo-to-jpg']
  },

  // 4. PHOTO COMPRESS
  {
    id: 'photo-compress',
    path: '/tools/photo-compress',
    category: 'compression',
    categoryTitle: 'Compression Tools',
    categoryTitleTa: 'கம்ப்ரஷன் கருவிகள்',
    title: 'Photo Compressor Online – Reduce Image Size in KB | AK e-Sevai',
    titleTa: 'போட்டோ கம்ப்ரஸர் ஆன்லைன் – போட்டோ அளவை KB-யில் குறைக்க | AK e-Sevai',
    description: 'Compress JPG, PNG, WEBP images online without losing visual quality. Reduce photo size in KB or MB with dynamic quality sliders and instant live size preview.',
    descriptionTa: 'JPG, PNG மற்றும் WEBP படங்களின் தெளிவுத்திறன் குறையாமல் அவற்றின் அளவை KB மற்றும் MB-யில் ஆன்லைனில் விரைவாக குறையுங்கள்.',
    keywords: 'photo compressor, compress photo online, compress image online, reduce photo size, reduce image size, photo size reducer, photo compress செய்ய, image size reducer',
    mode: 'compress',
    icon: 'Minimize2',
    badge: 'Dynamic KB Reducer',
    badgeTa: 'KB குறைப்பான்',
    shortDesc: 'Compress any photo to custom KB or percentage with live visual before/after comparison.',
    shortDescTa: 'படத்தின் அளவை விருப்பமான KB அளவிற்கு தரம் குறையாமல் உடனடியாக குறைக்கலாம்.',
    defaultTargetKb: 75,
    faqs: [
      {
        q: 'Does compressing a photo reduce its visual quality?',
        qTa: 'போட்டோவை கம்ப்ரஸ் செய்வதால் அதன் தெளிவு குறையுமா?',
        a: 'Our smart compression algorithm optimizes file metadata and color tables, reducing file size by up to 85% while keeping the face and text perfectly sharp.',
        aTa: 'எங்களின் நவீன கம்ப்ரஷன் முறை தேவையில்லாத மெட்டாடேட்டாவை நீக்குவதால், முகமும் எழுத்துக்களும் மிகத் தெளிவாக இருக்கும் அதே வேளையில் 85% வரை கோப்பு அளவு குறையும்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Photo', titleTa: 'புகைப்படத்தை பதிவேற்றவும்', text: 'Select JPG, PNG or WEBP image from your device.', textTa: 'JPG, PNG அல்லது WEBP படத்தை பதிவேற்றவும்.' },
      { step: 2, title: 'Set Target Size', titleTa: 'அளவைத் தேர்ந்தெடுக்கவும்', text: 'Move the quality slider or pick a preset KB target.', textTa: 'ஸ்லைடரை நகர்த்தி தேவையான KB அளவை வைக்கவும்.' },
      { step: 3, title: 'Download Compressed File', titleTa: 'பதிவிறக்கவும்', text: 'Preview the compressed result and click Download.', textTa: 'முடிவைப் பார்த்துவிட்டு உடனே பதிவிறக்கம் செய்யுங்கள்.' }
    ],
    relatedTools: ['photo-compress-20kb', 'photo-compress-50kb', 'photo-compress-100kb', 'photo-resizer', 'photo-to-jpg']
  },

  // 5. PHOTO COMPRESS 20KB
  {
    id: 'photo-compress-20kb',
    path: '/tools/photo-compress-20kb',
    category: 'compression',
    categoryTitle: 'Compression Tools',
    categoryTitleTa: 'கம்ப்ரஷன் கருவிகள்',
    title: 'Compress Photo to 20 KB Online – Signature & Photo Reducer | AK e-Sevai',
    titleTa: 'போட்டோவை 20 KB-க்கு குறைக்க – ஆன்லைன் இமேஜ் கம்ப்ரஸர் | AK e-Sevai',
    description: 'Compress photos and signatures to exact 20 KB or under 20 KB online for online exam forms, TNPSC, UPSC, SSC, IBPS and government job portals.',
    descriptionTa: 'கையொப்பம் மற்றும் புகைப்படங்களை சரியாக 20 KB அல்லது 20 KB-க்குள் இருக்கும்படி ஆன்லைனில் சுருக்குங்கள். TNPSC, SSC, வங்கித் தேர்வு விண்ணப்பங்களுக்கு ஏற்றது.',
    keywords: 'compress photo to 20kb, photo compress to 20 kb, signature compress 20kb, reduce photo size to 20kb, photo 20 KB க்கு குறைக்க, signature resize 20kb',
    mode: 'compress-target',
    icon: 'FileDigit',
    badge: 'Target: ≤ 20 KB',
    badgeTa: 'இலக்கு: ≤ 20 KB',
    shortDesc: 'Specialized compressor targeting exactly under 20 KB for signatures and exam thumbnails.',
    shortDescTa: 'அரசு தேர்வு கையொப்பம் மற்றும் சிறு புகைப்படங்களை 20 KB-க்குள் சரியாக சுருக்க உதவும் கருவி.',
    defaultTargetKb: 20,
    faqs: [
      {
        q: 'Why do exams require signatures under 20 KB?',
        qTa: 'அரசுத் தேர்வுகளில் கையொப்பத்தை 20 KB-க்குள் ஏன் கேட்கிறார்கள்?',
        a: 'Government servers restrict signature file sizes to 10 KB–20 KB to ensure fast hall ticket generation. Check the official exam notification before uploading.',
        aTa: 'ஹால் டிக்கெட் தயாரிப்பை விரைவுபடுத்த அரசு இணையதளங்கள் கையொப்பத்தை 10 KB முதல் 20 KB வரை மட்டுமே ஏற்கின்றன. விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ அறிவிப்பை சரிபார்க்கவும்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Signature / Photo', titleTa: 'கையொப்பம் / போட்டோவை பதிவேற்றவும்', text: 'Upload your photo or cropped signature image.', textTa: 'உங்கள் கையொப்பம் அல்லது புகைப்படத்தை பதிவேற்றவும்.' },
      { step: 2, title: 'Auto 20 KB Optimize', titleTa: 'தானாக 20 KB-க்கு மாறும்', text: 'Our engine automatically compresses the image strictly under 20 KB.', textTa: 'எங்கள் கருவி தானாகவே படத்தை 20 KB வரம்பிற்குள் கொண்டு வரும்.' },
      { step: 3, title: 'Instant Download', titleTa: 'உடனடி பதிவிறக்கம்', text: 'Save your optimized file ready for portal upload.', textTa: 'விண்ணப்பத்தில் பதிவேற்ற தயாரான படத்தை சேமிக்கவும்.' }
    ],
    relatedTools: ['photo-compress', 'photo-compress-50kb', 'photo-compress-100kb', 'photo-crop', 'photo-to-jpg']
  },

  // 6. PHOTO COMPRESS 50KB
  {
    id: 'photo-compress-50kb',
    path: '/tools/photo-compress-50kb',
    category: 'compression',
    categoryTitle: 'Compression Tools',
    categoryTitleTa: 'கம்ப்ரஷன் கருவிகள்',
    title: 'Compress Photo to 50 KB Online – Free Photo Size Reducer | AK e-Sevai',
    titleTa: 'போட்டோவை 50 KB-க்கு குறைக்க – பாஸ்போர்ட் போட்டோ கம்ப்ரஸர் | AK e-Sevai',
    description: 'Compress JPG and PNG photos to under 50 KB online. Perfect for TNPSC, SSC, Railway RRB, NEET, JEE, CTET and Tamil Nadu e-Sevai online applications.',
    descriptionTa: 'புகைப்படங்களை சரியாக 50 KB-க்குள் இருக்கும்படி ஆன்லைனில் கம்ப்ரஸ் செய்யுங்கள். TNPSC, SSC, ரயில்வே, NEET மற்றும் கல்லூரி சேர்க்கை விண்ணப்பங்களுக்கு ஏற்றது.',
    keywords: 'compress photo to 50kb, reduce photo to 50kb, image compressor 50kb, photo 50 kb size online, photo 50 KB க்கு குறைக்க, tnpsc photo compress 50kb',
    mode: 'compress-target',
    icon: 'FileCheck',
    badge: 'Target: ≤ 50 KB',
    badgeTa: 'இலக்கு: ≤ 50 KB',
    shortDesc: 'Auto-compress passport photos under 50 KB for TNPSC, SSC, and TN e-Sevai portals.',
    shortDescTa: 'TNPSC, SSC மற்றும் அரசு சான்றிதழ் விண்ணப்பங்களுக்கு போட்டோவை 50 KB-க்குள் மாற்றவும்.',
    defaultTargetKb: 50,
    faqs: [
      {
        q: 'Is 50 KB the standard limit for TNPSC Group 4 and SSC exams?',
        qTa: 'TNPSC குரூப் 4 மற்றும் SSC தேர்வுகளுக்கு 50 KB போதுமானதா?',
        a: 'Yes, most TNPSC and SSC online applications require applicant photos between 20 KB and 50 KB. Check the current official notification before uploading.',
        aTa: 'ஆம், பெரும்பாலான TNPSC மற்றும் SSC தேர்வுகளில் போட்டோ 20 KB முதல் 50 KB வரை இருக்க வேண்டும். விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ அறிவிப்பை சரிபார்க்கவும்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Photo', titleTa: 'புகைப்படத்தை பதிவேற்றவும்', text: 'Select your passport photo.', textTa: 'உங்கள் பாஸ்போர்ட் படத்தை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Smart 50 KB Fit', titleTa: '50 KB வரம்பிற்குள் சுருக்குதல்', text: 'Engine balances sharpness and brings size under 50 KB.', textTa: 'தெளிவு மாறாமல் கோப்பு அளவு 50 KB-க்குள் சுருக்கப்படுகிறது.' },
      { step: 3, title: 'Download & Upload', titleTa: 'பதிவிறக்கி பதிவேற்றவும்', text: 'Download the verified image and upload to the exam portal.', textTa: 'பதிவிறக்கம் செய்து தேர்வு இணையதளத்தில் பதிவேற்றவும்.' }
    ],
    relatedTools: ['passport-size-photo', 'photo-compress', 'photo-compress-20kb', 'photo-compress-100kb', 'photo-to-jpg']
  },

  // 7. PHOTO COMPRESS 100KB
  {
    id: 'photo-compress-100kb',
    path: '/tools/photo-compress-100kb',
    category: 'compression',
    categoryTitle: 'Compression Tools',
    categoryTitleTa: 'கம்ப்ரஷன் கருவிகள்',
    title: 'Compress Photo to 100 KB Online – Free Image Compressor | AK e-Sevai',
    titleTa: 'போட்டோவை 100 KB-க்கு குறைக்க – இலவச இமேஜ் கம்ப்ரஸர் | AK e-Sevai',
    description: 'Compress JPG, PNG and WEBP photos to 100 KB online. Resize, compress and download high quality photos for government certificate and e-Sevai portals.',
    descriptionTa: 'JPG, PNG மற்றும் WEBP புகைப்படங்களை 100 KB அளவிற்கு சுருக்கி பதிவிறக்கம் செய்யுங்கள். அரசு இ-சேவை சான்றிதழ்கள் மற்றும் அடையாள அட்டை பதிவேற்றங்களுக்கு ஏற்றது.',
    keywords: 'compress photo to 100kb, compress image to 100kb, photo compressor under 100kb, reduce photo size under 100kb, photo 100 KB க்கு குறைக்க, image size 100kb',
    mode: 'compress-target',
    icon: 'FileSpreadsheet',
    badge: 'Target: ≤ 100 KB',
    badgeTa: 'இலக்கு: ≤ 100 KB',
    shortDesc: 'Compress photos & scanned document images strictly under 100 KB for e-Sevai document vaults.',
    shortDescTa: 'இ-சேவை ஆவண பெட்டகத்திற்காக படங்களை 100 KB-க்குள் சரியாக சுருக்கும் சிறப்புக் கருவி.',
    defaultTargetKb: 100,
    faqs: [
      {
        q: 'Why does AK e-Sevai vault require documents under 100 KB?',
        qTa: 'AK e-Sevai ஆவணப் பெட்டகத்தில் 100 KB வரம்பு ஏன் உள்ளது?',
        a: 'The Tamil Nadu e-District portal sets a strict 100 KB limit for certificate and revenue attachments (Aadhaar, Ration Card, Salary Certificate). Keeping files under 100 KB ensures 100% upload success.',
        aTa: 'தமிழ்நாடு அரசு இ-மாவட்ட இணையதளம் சான்றிதழ் இணைப்புகளுக்கு 100 KB வரம்பை விதித்துள்ளது. இதனால் 100 KB-க்குள் வைப்பது தடையின்றி பதிவேற்ற உதவுகிறது.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Scanned Photo/Doc', titleTa: 'ஆவணப் படத்தை பதிவேற்றவும்', text: 'Select your photo or scanned document image.', textTa: 'உங்கள் புகைப்படம் அல்லது ஸ்கேன் செய்த ஆவணத்தை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Auto 100 KB Reduction', titleTa: '100 KB-க்குள் குறைத்தல்', text: 'Optimizes file binary to stay between 70 KB and 98 KB.', textTa: '70 KB முதல் 98 KB-க்குள் மிகச் சரியாக அமுக்கப்படுகிறது.' },
      { step: 3, title: 'Download File', titleTa: 'கோப்பை பதிவிறக்கவும்', text: 'Download the certificate-ready image.', textTa: 'இணையதளத்தில் பதிவேற்ற தயாரான படத்தை சேமிக்கவும்.' }
    ],
    relatedTools: ['photo-compress', 'photo-compress-50kb', 'photo-compress-20kb', 'jpg-to-pdf', 'photo-to-jpg']
  },

  // 8. PHOTO RESIZER
  {
    id: 'photo-resizer',
    path: '/tools/photo-resizer',
    category: 'crop-resize',
    categoryTitle: 'Crop & Resize Tools',
    categoryTitleTa: 'க்ராப் & ரீசைஸ் கருவிகள்',
    title: 'Photo Resizer Online – Resize Image in KB and Pixels | AK e-Sevai',
    titleTa: 'போட்டோ ரீசைசர் ஆன்லைன் – பிக்சல் மற்றும் KB-ல் மாற்ற | AK e-Sevai',
    description: 'Resize image dimensions in pixels (width x height), centimeters, inches or percentages with aspect ratio lock and DPI settings for print and web.',
    descriptionTa: 'படங்களின் நீள அகலங்களை பிக்சல், சென்டிமீட்டர், இன்ச் அல்லது சதவீத அளவில் மாற்றி அச்சிடுவதற்கும் இணையத்தில் பதிவேற்றவும் தயார் செய்யுங்கள்.',
    keywords: 'photo resize online, resize image in kb, resize photo in pixels, photo dimensions changer, photo resize செய்ய, image resizer online',
    mode: 'resize',
    icon: 'Maximize2',
    badge: 'Pixel & DPI Resizer',
    badgeTa: 'பிக்சல் & DPI ரீசைசர்',
    shortDesc: 'Change pixel dimensions (Width × Height), aspect ratio, and DPI with exact measurement controls.',
    shortDescTa: 'படத்தின் பிக்சல் அளவு, DPI மற்றும் விகிதங்களை விருப்பப்படி துல்லியமாக மாற்றலாம்.',
    defaultTargetKb: 100,
    presetSizes: [
      { label: '640 × 480 px (VGA Standard)', w: 640, h: 480, name: 'VGA 640x480' },
      { label: '800 × 600 px (SVGA Medium)', w: 800, h: 600, name: 'SVGA 800x600' },
      { label: '1024 × 768 px (XGA Web Standard)', w: 1024, h: 768, name: 'XGA 1024x768' },
      { label: '1920 × 1080 px (Full HD 1080p)', w: 1920, h: 1080, name: 'Full HD' }
    ],
    faqs: [
      {
        q: 'Can I resize photos by percentage?',
        qTa: 'போட்டோவை சதவீத அளவில் (Percentage) குறைக்க முடியுமா?',
        a: 'Yes, our tool supports 25%, 50%, 75%, or custom percentage scale resizing while maintaining the original aspect ratio.',
        aTa: 'ஆம், 25%, 50%, 75% அல்லது உங்கள் விருப்ப சதவீதத்தில் விகிதம் மாறாமல் படத்தை எளிதாக மாற்றலாம்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Image', titleTa: 'படத்தை பதிவேற்றவும்', text: 'Select an image from your device.', textTa: 'உங்கள் சாதனத்திலிருந்து படத்தை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Enter Width & Height', titleTa: 'அளவுகளை உள்ளிடவும்', text: 'Type new pixel dimensions or select a preset.', textTa: 'புதிய பிக்சல் அளவை உள்ளிடவும் அல்லது தேர்வை தேர்ந்தெடுக்கவும்.' },
      { step: 3, title: 'Download Resized Image', titleTa: 'படத்தை பதிவிறக்கவும்', text: 'Download your resized high-resolution photo.', textTa: 'புதிய பரிமாணங்களுடன் படத்தை உடனடியாக பதிவிறக்கவும்.' }
    ],
    relatedTools: ['passport-photo-resize', 'photo-crop', 'photo-compress', 'photo-editor', 'photo-to-png']
  },

  // 9. PHOTO EDITOR
  {
    id: 'photo-editor',
    path: '/tools/photo-editor',
    category: 'editor',
    categoryTitle: 'Photo Editing & Studio',
    categoryTitleTa: 'புகைப்பட எடிட்டிங் & ஸ்டுடியோ',
    title: 'Photo Editor Online – Enhance Lighting, Contrast & Studio Filters | AK e-Sevai',
    titleTa: 'போட்டோ எடிட்டர் ஆன்லைன் – வெளிச்சம் & நிறத்தை மேம்படுத்த | AK e-Sevai',
    description: 'Edit photos online with brightness, contrast, saturation, sharpness, rotation, grayscale, and studio enhancement filters for passport and certificate photos.',
    descriptionTa: 'புகைப்படங்களின் வெளிச்சம், கான்ட்ராஸ்ட், நிறச்செறிவு, சுழற்சி மற்றும் ஸ்டுடியோ பில்டர்களை ஆன்லைனில் இலவசமாக மாற்றி அழகுபடுத்துங்கள்.',
    keywords: 'photo editor online, passport photo editor, enhance photo online, brighten photo online, photo editor செய்ய, image enhancer online',
    mode: 'editor',
    icon: 'Sparkles',
    badge: 'Studio Color & Light',
    badgeTa: 'ஸ்டுடியோ வெளிச்ச எடிட்டர்',
    shortDesc: 'Adjust brightness, contrast, sharpness, rotate 90°, and apply studio filters easily.',
    shortDescTa: 'வெளிச்சம், கான்ட்ராஸ்ட், சுழற்சி மற்றும் ஸ்டுடியோ நிறங்களை சுலபமாக மாற்றலாம்.',
    defaultTargetKb: 100,
    faqs: [
      {
        q: 'How to fix dark or underexposed photos for online forms?',
        qTa: 'இருண்ட புகைப்படங்களின் வெளிச்சத்தை எவ்வாறு அதிகரிப்பது?',
        a: 'Upload your photo and increase the Brightness slider to 115%–130% and Contrast to 110% to achieve studio-quality clarity.',
        aTa: 'போட்டோவை பதிவேற்றி, Brightness ஸ்லைடரை 115% முதல் 130% வரை உயர்த்தி, Contrast-ஐ 110% வைத்தால் ஸ்டுடியோ போன்ற வெளிச்சம் கிடைக்கும்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Photo', titleTa: 'புகைப்படத்தை பதிவேற்றவும்', text: 'Select a photo that needs lighting or color adjustment.', textTa: 'வெளிச்சம் மாற்ற வேண்டிய படத்தை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Adjust Sliders', titleTa: 'ஸ்லைடர்களை சரிசெய்யவும்', text: 'Tweak brightness, contrast, saturation, and rotation.', textTa: 'வெளிச்சம், கான்ட்ராஸ்ட் மற்றும் சுழற்சியை மாற்றவும்.' },
      { step: 3, title: 'Save Enhanced Photo', titleTa: 'மேம்படுத்திய படத்தை சேமிக்கவும்', text: 'Download the enhanced photo with studio quality.', textTa: 'ஸ்டுடியோ தரத்திலான படத்தை பதிவிறக்கம் செய்யவும்.' }
    ],
    relatedTools: ['passport-size-photo', 'photo-background-change', 'photo-crop', 'photo-compress-50kb', 'photo-to-jpg']
  },

  // 10. PHOTO BACKGROUND CHANGE
  {
    id: 'photo-background-change',
    path: '/tools/photo-background-change',
    category: 'editor',
    categoryTitle: 'Photo Editing & Studio',
    categoryTitleTa: 'புகைப்பட எடிட்டிங் & ஸ்டுடியோ',
    title: 'Photo Background Changer Online – White, Light Blue & Studio Colors | AK e-Sevai',
    titleTa: 'போட்டோ பின்னணி நிறம் மாற்ற – வெள்ளை, வெளிர் நீலம் | AK e-Sevai',
    description: 'Change photo background color to official white, light blue, light grey or custom studio colors for passport, visa, and government job applications.',
    descriptionTa: 'பாஸ்போர்ட் மற்றும் அரசுத் தேர்வு விதிகளின்படி புகைப்படத்தின் பின்னணி நிறத்தை வெள்ளை அல்லது வெளிர் நீலமாக எளிதாக மாற்றுங்கள்.',
    keywords: 'photo background change, passport photo background light blue, change photo background white, photo background colour changer, photo background மாற்ற',
    mode: 'background',
    icon: 'Palette',
    badge: 'Official Background Palette',
    badgeTa: 'அரசு பின்னணி நிறங்கள்',
    shortDesc: 'Swap background colors to official Passport White, Light Blue, Cyan, or Studio Grey.',
    shortDescTa: 'பாஸ்போர்ட் வெள்ளை, வெளிர் நீலம் அல்லது சாம்பல் நிறத்திற்கு பின்னணியை மாற்றலாம்.',
    defaultTargetKb: 60,
    faqs: [
      {
        q: 'Which background color is required for Indian passport and exam photos?',
        qTa: 'இந்திய பாஸ்போர்ட் மற்றும் தேர்வுகளுக்கு என்ன பின்னணி நிறம் தேவை?',
        a: 'Indian passport photos strictly require a plain white or light off-white background. TNPSC and UPSC allow plain white or light blue backgrounds. Always verify current official guidelines.',
        aTa: 'இந்திய பாஸ்போர்ட்டிற்கு வெற்று வெள்ளை பின்னணி கட்டாயம். TNPSC மற்றும் UPSC தேர்வுகளுக்கு வெள்ளை அல்லது வெளிர் நீல பின்னணி அனுமதிக்கப்படுகிறது.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Photo', titleTa: 'புகைப்படத்தை பதிவேற்றவும்', text: 'Upload your portrait or passport photo.', textTa: 'உங்கள் முகப்படத்தை பதிவேற்றவும்.' },
      { step: 2, title: 'Pick Background Color', titleTa: 'பின்னணி நிறத்தை தேர்வு செய்யவும்', text: 'Click White (#ffffff), Light Blue (#cce5ff), or Custom color.', textTa: 'வெள்ளை அல்லது வெளிர் நீல நிறத்தை தேர்ந்தெடுக்கவும்.' },
      { step: 3, title: 'Download Result', titleTa: 'முடிவை பதிவிறக்கவும்', text: 'Download your passport-ready photo with the new background.', textTa: 'புதிய பின்னணியுடன் கூடிய புகைப்படத்தை சேமிக்கவும்.' }
    ],
    relatedTools: ['passport-size-photo', 'photo-editor', 'photo-crop', 'photo-compress-50kb', 'photo-to-jpg']
  },

  // 11. PHOTO TO JPG
  {
    id: 'photo-to-jpg',
    path: '/tools/photo-to-jpg',
    category: 'converter',
    categoryTitle: 'Image Format Converters',
    categoryTitleTa: 'பட வடிவ மாற்றிகள்',
    title: 'Photo to JPG Converter Online – Convert PNG, WEBP, HEIC to JPG | AK e-Sevai',
    titleTa: 'போட்டோவை JPG-ஆக மாற்ற – இலவச இமேஜ் கன்வெர்ட்டர் | AK e-Sevai',
    description: 'Convert any photo format (PNG, WEBP, BMP, GIF, HEIC) to high-quality JPG / JPEG format online with customizable compression quality. 100% free.',
    descriptionTa: 'PNG, WEBP, BMP, GIF போன்ற எந்த வடிவத்திலான படங்களையும் உயர்தர JPG / JPEG வடிவத்திற்கு ஆன்லைனில் இலவசமாக மாற்றுங்கள்.',
    keywords: 'photo to jpg, convert photo to jpg, image to jpg, webp to jpg, png to jpg converter, photo jpg மாற்ற, convert image to jpg',
    mode: 'convert',
    targetFormat: 'jpg',
    icon: 'FileImage',
    badge: 'Universal JPG Converter',
    badgeTa: 'JPG மாற்றுக் கருவி',
    shortDesc: 'Convert PNG, WEBP, BMP or camera photos to standard JPG format accepted everywhere.',
    shortDescTa: 'எந்தவொரு படத்தையும் அரசு தளங்கள் ஏற்கும் தரமான JPG வடிவத்திற்கு மாற்றலாம்.',
    defaultTargetKb: 80,
    faqs: [
      {
        q: 'Why do government portals only accept JPG format?',
        qTa: 'அரசு இணையதளங்கள் ஏன் JPG கோப்புகளை மட்டுமே ஏற்கின்றன?',
        a: 'JPG / JPEG provides the best compression ratio while maintaining good visual fidelity, making it the most widely supported standard across government web servers.',
        aTa: 'JPG வடிவம் குறைந்த கோப்பு அளவில் சிறந்த தெளிவை தருவதால், அரசு சர்வர்கள் இதனை உலகளாவிய தரநிலையாக கொண்டுள்ளன.'
      }
    ],
    howTo: [
      { step: 1, title: 'Select File', titleTa: 'கோப்பை தேர்ந்தெடுக்கவும்', text: 'Upload any PNG, WEBP or BMP file.', textTa: 'PNG, WEBP அல்லது BMP படத்தை பதிவேற்றவும்.' },
      { step: 2, title: 'Set Quality', titleTa: 'தரத்தை தேர்ந்தெடுக்கவும்', text: 'Choose High (90%), Medium (75%) or Standard quality.', textTa: 'தேவையான தர அளவை தேர்ந்தெடுக்கவும்.' },
      { step: 3, title: 'Download JPG', titleTa: 'JPG கோப்பை பதிவிறக்கவும்', text: 'Download the newly converted JPG image.', textTa: 'மாற்றப்பட்ட புதிய JPG படத்தை உடனே சேமிக்கவும்.' }
    ],
    relatedTools: ['jpg-to-png', 'photo-to-png', 'photo-compress', 'jpg-to-pdf', 'passport-size-photo']
  },

  // 12. PHOTO TO PNG
  {
    id: 'photo-to-png',
    path: '/tools/photo-to-png',
    category: 'converter',
    categoryTitle: 'Image Format Converters',
    categoryTitleTa: 'பட வடிவ மாற்றிகள்',
    title: 'Photo to PNG Converter Online – Convert JPG, WEBP to PNG | AK e-Sevai',
    titleTa: 'போட்டோவை PNG-ஆக மாற்ற – உயர்தர இமேஜ் கன்வெர்ட்டர் | AK e-Sevai',
    description: 'Convert JPG, JPEG, WEBP and BMP images to crystal clear, lossless PNG format online with zero quality degradation. Fast and secure.',
    descriptionTa: 'JPG, WEBP மற்றும் BMP படங்களை துல்லியமான, தரமிக்க PNG வடிவத்திற்கு ஆன்லைனில் உடனடியாக மாற்றி சேமித்துக் கொள்ளுங்கள்.',
    keywords: 'photo to png, convert photo to png, image to png, jpg to png converter, photo png மாற்ற, lossless png converter',
    mode: 'convert',
    targetFormat: 'png',
    icon: 'Layers',
    badge: 'Lossless PNG Output',
    badgeTa: 'தெளிவான PNG வெளியீடு',
    shortDesc: 'Convert JPG or WEBP to high-resolution PNG with lossless quality for signatures and logos.',
    shortDescTa: 'கையொப்பங்கள் மற்றும் லோகோக்களுக்கு ஏற்ற வகையில் தெளிவான PNG-யாக மாற்றவும்.',
    defaultTargetKb: 120,
    faqs: [
      {
        q: 'When should I use PNG instead of JPG?',
        qTa: 'JPG-க்கு பதிலாக PNG-ஐ எப்போது பயன்படுத்த வேண்டும்?',
        a: 'Use PNG for signatures, stamps, logos, and documents with text where crisp, sharp edges and lossless reproduction are critical.',
        aTa: 'கையொப்பங்கள், முத்திரைகள், லோகோக்கள் மற்றும் எழுத்துக்கள் உள்ள ஆவணங்களுக்கு மிகத் தெளிவான PNG வடிவமே சிறந்தது.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Photo', titleTa: 'புகைப்படத்தை பதிவேற்றவும்', text: 'Upload JPG or WEBP file.', textTa: 'JPG அல்லது WEBP படத்தை பதிவேற்றவும்.' },
      { step: 2, title: 'Convert', titleTa: 'PNG-ஆக மாற்றவும்', text: 'Click convert to render lossless PNG canvas.', textTa: 'கன்வெர்ட் பட்டனை அழுத்தி PNG-யாக மாற்றவும்.' },
      { step: 3, title: 'Download PNG', titleTa: 'PNG கோப்பை பதிவிறக்கவும்', text: 'Download the high-clarity PNG file.', textTa: 'உயர்தர PNG கோப்பை உடனடியாக பதிவிறக்கவும்.' }
    ],
    relatedTools: ['png-to-jpg', 'jpg-to-png', 'photo-to-jpg', 'png-to-pdf', 'photo-crop']
  },

  // 13. JPG TO PNG
  {
    id: 'jpg-to-png',
    path: '/tools/jpg-to-png',
    category: 'converter',
    categoryTitle: 'Image Format Converters',
    categoryTitleTa: 'பட வடிவ மாற்றிகள்',
    title: 'JPG to PNG Converter Online – Free Lossless Image Conversion | AK e-Sevai',
    titleTa: 'JPG-ஐ PNG-ஆக மாற்ற – ஆன்லைன் கன்வெர்ட்டர் | AK e-Sevai',
    description: 'Convert JPG / JPEG images to lossless PNG format online. Keep sharp text, transparent layers, and high fidelity with client-side browser processing.',
    descriptionTa: 'JPG / JPEG படங்களை மிகத் தெளிவான PNG வடிவத்திற்கு ஆன்லைனில் மாற்றுங்கள். எழுத்துக்களின் துல்லியம் குறையாமல் எளிதாக மாற்றலாம்.',
    keywords: 'jpg to png, convert jpg to png, jpg to png converter, jpeg to png online, jpg png மாற்ற, free jpg to png',
    mode: 'convert',
    targetFormat: 'png',
    icon: 'ArrowRightLeft',
    badge: 'JPG ➔ PNG Fast',
    badgeTa: 'JPG ➔ PNG விரைவு',
    shortDesc: 'Instant 1-click JPG to PNG converter with lossless rendering.',
    shortDescTa: 'ஒரே கிளிக்கில் JPG படங்களை PNG படங்களாக மாற்றும் எளிய கருவி.',
    defaultTargetKb: 120,
    faqs: [
      {
        q: 'Is JPG to PNG conversion free and unlimited?',
        qTa: 'JPG to PNG மாற்றம் முற்றிலும் இலவசமா?',
        a: 'Yes, 100% free and unlimited with zero signups or watermarks.',
        aTa: 'ஆம், எவ்வித பதிவுக் கட்டணமோ வாட்டர்மார்க்கோ இன்றி முற்றிலும் இலவசமாக பயன்படுத்தலாம்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload JPG', titleTa: 'JPG படத்தை பதிவேற்றவும்', text: 'Select your JPG / JPEG file.', textTa: 'உங்கள் JPG கோப்பை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Process', titleTa: 'மாற்றுதல்', text: 'Image is instantly converted on device.', textTa: 'உங்கள் சாதனத்திலேயே உடனே மாற்றப்படுகிறது.' },
      { step: 3, title: 'Download PNG', titleTa: 'PNG பதிவிறக்கம்', text: 'Click Download to save your PNG.', textTa: 'புதிய PNG கோப்பை பதிவிறக்கம் செய்யவும்.' }
    ],
    relatedTools: ['png-to-jpg', 'photo-to-jpg', 'photo-to-png', 'jpg-to-pdf', 'photo-compress']
  },

  // 14. PNG TO JPG
  {
    id: 'png-to-jpg',
    path: '/tools/png-to-jpg',
    category: 'converter',
    categoryTitle: 'Image Format Converters',
    categoryTitleTa: 'பட வடிவ மாற்றிகள்',
    title: 'PNG to JPG Converter Online – Fast Image Format Conversion | AK e-Sevai',
    titleTa: 'PNG-ஐ JPG-ஆக மாற்ற – இலவச இமேஜ் கன்வெர்ட்டர் | AK e-Sevai',
    description: 'Convert PNG images to compact JPG format online with white background fill for transparent areas and adjustable compression. 100% private.',
    descriptionTa: 'PNG படங்களை குறைந்த அளவிலான JPG வடிவத்திற்கு ஆன்லைனில் மாற்றுங்கள். வெளிப்படையான பின்னணி தானாக வெள்ளை நிறமாக மாற்றப்பட்டு சுருக்கப்படும்.',
    keywords: 'png to jpg, convert png to jpg, png to jpg converter, png to jpeg online, png jpg மாற்ற, png to jpg online',
    mode: 'convert',
    targetFormat: 'jpg',
    icon: 'ArrowLeftRight',
    badge: 'PNG ➔ JPG Compact',
    badgeTa: 'PNG ➔ JPG கச்சிதம்',
    shortDesc: 'Convert PNG screenshots and graphics to compact JPG with white background fill.',
    shortDescTa: 'PNG ஸ்கிரீன்ஷாட்கள் மற்றும் படங்களை குறைந்த அளவிலான JPG-ஆக மாற்றவும்.',
    defaultTargetKb: 80,
    faqs: [
      {
        q: 'What happens to transparent backgrounds when converting PNG to JPG?',
        qTa: 'PNG-ஐ JPG-ஆக மாற்றும்போது வெளிப்படையான பின்னணி என்னவாகும்?',
        a: 'Since JPG does not support transparency, transparent areas are automatically filled with clean white background, ideal for document submissions.',
        aTa: 'JPG-ல் வெளிப்படைத்தன்மை இருக்காது என்பதால், அந்த பகுதிகள் தானாகவே சுத்தமான வெள்ளை நிற பின்னணியாக மாற்றப்படும்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload PNG', titleTa: 'PNG படத்தை பதிவேற்றவும்', text: 'Select your PNG file.', textTa: 'உங்கள் PNG கோப்பை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Convert', titleTa: 'JPG-ஆக மாற்றவும்', text: 'Select compression level and convert.', textTa: 'கம்ப்ரஷன் அளவை வைத்து மாற்றவும்.' },
      { step: 3, title: 'Download JPG', titleTa: 'JPG பதிவிறக்கம்', text: 'Save your compressed JPG image.', textTa: 'புதிய JPG கோப்பை சேமிக்கவும்.' }
    ],
    relatedTools: ['jpg-to-png', 'photo-to-jpg', 'photo-compress', 'png-to-pdf', 'photo-resizer']
  },

  // 15. JPG TO PDF
  {
    id: 'jpg-to-pdf',
    path: '/tools/jpg-to-pdf',
    category: 'pdf',
    categoryTitle: 'PDF & Document Tools',
    categoryTitleTa: 'PDF & ஆவணக் கருவிகள்',
    title: 'JPG to PDF Converter Online – Convert Photos to PDF Document | AK e-Sevai',
    titleTa: 'JPG-ஐ PDF-ஆக மாற்ற – போட்டோக்களை PDF ஆவணமாக மாற்ற | AK e-Sevai',
    description: 'Convert JPG photos to clean, printable A4 PDF documents online. Adjust orientation (Portrait/Landscape), margins, and compress PDF under 100 KB / 200 KB.',
    descriptionTa: 'JPG புகைப்படங்களை அச்சிடத்தக்க A4 PDF ஆவணமாக ஆன்லைனில் மாற்றுங்கள். போர்ட்ரெய்ட் / லேண்ட்ஸ்கேப் அமைத்து 100 KB அல்லது 200 KB-க்குள் சுருக்கி பதிவிறக்குங்கள்.',
    keywords: 'jpg to pdf, convert jpg to pdf, photo to pdf, image to pdf, images to pdf, jpg pdf மாற்ற, photo pdf மாற்ற, convert photo to pdf',
    mode: 'image-to-pdf',
    allowedExt: 'jpg',
    icon: 'FileText',
    badge: 'A4 Printable PDF',
    badgeTa: 'A4 PDF ஆவணம்',
    shortDesc: 'Turn JPG images into printable A4 PDF documents with customizable margins and orientation.',
    shortDescTa: 'JPG படங்களை அச்சிடக்கூடிய தரமான A4 PDF ஆவணங்களாக மாற்றலாம்.',
    defaultTargetKb: 150,
    faqs: [
      {
        q: 'Can I set A4 page size and margins for the generated PDF?',
        qTa: 'உருவாக்கப்படும் PDF-க்கு A4 தாள் மற்றும் மார்ஜின் வைக்க முடியுமா?',
        a: 'Yes, you can choose A4 Portrait, A4 Landscape, Fit to Page, or Custom Margins (Small, Medium, None).',
        aTa: 'ஆம், A4 போர்ட்ரெய்ட், லேண்ட்ஸ்கேப் அல்லது மார்ஜின் அளவுகளை விருப்பப்படி தேர்வு செய்யலாம்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload JPG File(s)', titleTa: 'JPG கோப்பை பதிவேற்றவும்', text: 'Select one or more JPG images.', textTa: 'ஒன்று அல்லது அதற்கு மேற்பட்ட JPG படங்களை தேர்வு செய்யவும்.' },
      { step: 2, title: 'Choose Page Layout', titleTa: 'பக்க அமைப்பை தேர்வு செய்யவும்', text: 'Pick A4 Portrait/Landscape and margin width.', textTa: 'A4 தாள் மற்றும் மார்ஜின் அளவை தேர்ந்தெடுக்கவும்.' },
      { step: 3, title: 'Generate & Download PDF', titleTa: 'PDF-ஐ பதிவிறக்கவும்', text: 'Click Generate PDF to download your ready document.', textTa: 'PDF உருவாக்கு பட்டனை அழுத்தி உடனே ஆவணத்தை பதிவிறக்கவும்.' }
    ],
    relatedTools: ['png-to-pdf', 'image-to-pdf', 'pdf-to-jpg', 'pdf-compress', 'photo-compress-100kb']
  },

  // 16. PNG TO PDF
  {
    id: 'png-to-pdf',
    path: '/tools/png-to-pdf',
    category: 'pdf',
    categoryTitle: 'PDF & Document Tools',
    categoryTitleTa: 'PDF & ஆவணக் கருவிகள்',
    title: 'PNG to PDF Converter Online – Convert PNG Images to PDF Document | AK e-Sevai',
    titleTa: 'PNG-ஐ PDF-ஆக மாற்ற – PNG படங்களை PDF-ஆக மாற்ற | AK e-Sevai',
    description: 'Convert PNG images to crisp PDF documents online. Merge multiple PNG screenshots, receipts, and certificates into a single PDF document.',
    descriptionTa: 'PNG படங்கள், ரசீதுகள் மற்றும் சான்றிதழ்களை உயர்தர PDF ஆவணமாக ஆன்லைனில் மாற்றி இணைத்து பதிவிறக்கம் செய்யுங்கள்.',
    keywords: 'png to pdf, convert png to pdf, png to pdf converter, images to pdf, png pdf மாற்ற, photo to pdf online',
    mode: 'image-to-pdf',
    allowedExt: 'png',
    icon: 'FileType',
    badge: 'Sharp PNG ➔ PDF',
    badgeTa: 'துல்லிய PNG ➔ PDF',
    shortDesc: 'Convert high-resolution PNG receipts and certificates into crisp PDF files.',
    shortDescTa: 'PNG ரசீதுகள் மற்றும் சான்றிதழ்களை தெளிவான PDF ஆவணங்களாக மாற்றவும்.',
    defaultTargetKb: 150,
    faqs: [
      {
        q: 'Will the text in my PNG certificate stay clear after converting to PDF?',
        qTa: 'PNG சான்றிதழில் உள்ள எழுத்துக்கள் PDF ஆன பிறகும் தெளிவாக இருக்குமா?',
        a: 'Yes, our vector-aligned PDF rendering maintains 100% native resolution for text and signatures without blurry artifacts.',
        aTa: 'ஆம், எங்களின் உயர்தர PDF முறையில் எழுத்துக்களும் கையொப்பமும் எவ்வித மங்கலுமின்றி மிகத் தெளிவாக இருக்கும்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload PNG Files', titleTa: 'PNG கோப்புகளை பதிவேற்றவும்', text: 'Select your PNG certificate or screenshot.', textTa: 'உங்கள் PNG சான்றிதழ் படத்தை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Configure PDF', titleTa: 'PDF அமைப்புகளை வைக்கவும்', text: 'Select paper size and page orientation.', textTa: 'தாளின் அளவு மற்றும் அமைப்பை தேர்ந்தெடுக்கவும்.' },
      { step: 3, title: 'Download PDF', titleTa: 'PDF பதிவிறக்கம்', text: 'Save your combined PDF document.', textTa: 'புதிய PDF ஆவணத்தை உடனே சேமிக்கவும்.' }
    ],
    relatedTools: ['jpg-to-pdf', 'image-to-pdf', 'pdf-to-jpg', 'pdf-compress', 'png-to-jpg']
  },

  // 17. IMAGE TO PDF
  {
    id: 'image-to-pdf',
    path: '/tools/image-to-pdf',
    category: 'pdf',
    categoryTitle: 'PDF & Document Tools',
    categoryTitleTa: 'PDF & ஆவணக் கருவிகள்',
    title: 'Image to PDF Converter Online – Merge Multiple Photos into PDF | AK e-Sevai',
    titleTa: 'இமேஜ் to PDF கன்வெர்ட்டர் – பல படங்களை ஒரே PDF-ஆக இணைக்க | AK e-Sevai',
    description: 'Combine and merge multiple images (JPG, PNG, WEBP) into a single high-quality PDF document. Rearrange pages, set margins, compress and download instantly.',
    descriptionTa: 'பல புகைப்படங்கள் மற்றும் ஆவணப் படங்களை (JPG, PNG, WEBP) ஒரே PDF ஆவணமாக இணைத்து ஆன்லைனில் உடனடியாக பதிவிறக்கம் செய்யுங்கள்.',
    keywords: 'image to pdf, photo to pdf, merge images to pdf, convert multiple photos to pdf, images to pdf online, photo pdf மாற்ற, image to pdf converter',
    mode: 'multi-image-to-pdf',
    icon: 'Combine',
    badge: 'Multi-Page PDF Merger',
    badgeTa: 'பல பக்க PDF இணைப்பான்',
    shortDesc: 'Merge multiple JPG, PNG and scanned pages into a single multi-page PDF document.',
    shortDescTa: 'பல படங்களை வரிசைப்படுத்தி ஒரே PDF கோப்பாக இணைத்து பதிவிறக்குங்கள்.',
    defaultTargetKb: 200,
    faqs: [
      {
        q: 'Can I rearrange the order of pages before creating the PDF?',
        qTa: 'PDF உருவாக்கும் முன் படங்களின் வரிசையை மாற்ற முடியுமா?',
        a: 'Yes, you can easily reorder images, delete specific pages, and adjust each page orientation before exporting.',
        aTa: 'ஆம், பக்கங்களின் வரிசையை மாற்றவும், தேவையற்ற பக்கங்களை நீக்கவும் எளிதான வசதிகள் உள்ளன.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Multiple Images', titleTa: 'பல படங்களை பதிவேற்றவும்', text: 'Select multiple photos or scanned documents.', textTa: 'இணைக்க வேண்டிய பல புகைப்படங்களை தேர்வு செய்யவும்.' },
      { step: 2, title: 'Organize Pages', titleTa: 'வரிசைப்படுத்தவும்', text: 'Reorder pages and choose A4 layout options.', textTa: 'பக்கங்களை வரிசைப்படுத்தி A4 அமைப்பை தேர்வு செய்யவும்.' },
      { step: 3, title: 'Download Combined PDF', titleTa: 'இணைந்த PDF-ஐ பதிவிறக்கவும்', text: 'Download single merged PDF file ready for submission.', textTa: 'இணைக்கப்பட்ட புதிய PDF ஆவணத்தை உடனடியாக சேமிக்கவும்.' }
    ],
    relatedTools: ['jpg-to-pdf', 'png-to-pdf', 'pdf-to-jpg', 'pdf-compress', 'photo-compress-100kb']
  },

  // 18. PDF TO JPG
  {
    id: 'pdf-to-jpg',
    path: '/tools/pdf-to-jpg',
    category: 'pdf',
    categoryTitle: 'PDF & Document Tools',
    categoryTitleTa: 'PDF & ஆவணக் கருவிகள்',
    title: 'PDF to JPG Converter Online – Extract PDF Pages to High-Res JPG | AK e-Sevai',
    titleTa: 'PDF-ஐ JPG-ஆக மாற்ற – PDF பக்கங்களை போட்டோவாக மாற்ற | AK e-Sevai',
    description: 'Convert PDF document pages into high-resolution JPG / PNG images online. Extract individual certificate pages or all pages with 1-click download.',
    descriptionTa: 'PDF ஆவணங்களின் பக்கங்களை உயர்தர JPG / PNG புகைப்படங்களாக ஆன்லைனில் மாற்றுங்கள். சான்றிதழ் பக்கங்களை தனித்தனி படங்களாக பிரித்தெடுக்கலாம்.',
    keywords: 'pdf to jpg, pdf to image, convert pdf to jpg, pdf to picture online, pdf jpg மாற்ற, pdf to image converter',
    mode: 'pdf-to-image',
    icon: 'FileSpreadsheet',
    badge: 'High-Res Page Extractor',
    badgeTa: 'உயர்தர பக்க பிரிப்பான்',
    shortDesc: 'Extract pages from PDF documents and save as sharp, high-DPI JPG images.',
    shortDescTa: 'PDF ஆவணத்தின் பக்கங்களை தனித்தனி தெளிவான JPG படங்களாக மாற்றவும்.',
    defaultTargetKb: 150,
    faqs: [
      {
        q: 'Can I convert multi-page PDF documents to JPG images?',
        qTa: 'பல பக்கங்கள் கொண்ட PDF ஆவணங்களை படங்களாக மாற்ற முடியுமா?',
        a: 'Yes, our tool renders each page into an individual high-resolution JPG image for instant viewing and downloading.',
        aTa: 'ஆம், ஒவ்வொரு பக்கத்தையும் உயர்தர JPG படமாக மாற்றி தனித்தனியாகவோ அல்லது மொத்தமாகவோ பதிவிறக்கம் செய்யலாம்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload PDF', titleTa: 'PDF-ஐ பதிவேற்றவும்', text: 'Select any PDF certificate or document.', textTa: 'உங்கள் PDF ஆவணத்தை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Select Pages', titleTa: 'பக்கங்களை தேர்வு செய்யவும்', text: 'Preview rendered pages and pick resolution.', textTa: 'பக்கங்களை பார்வையிட்டு தர அளவை வைக்கவும்.' },
      { step: 3, title: 'Download JPG Image(s)', titleTa: 'JPG படங்களை பதிவிறக்கவும்', text: 'Save high-quality JPG image to your device.', textTa: 'மாற்றப்பட்ட JPG புகைப்படத்தை உடனே சேமிக்கவும்.' }
    ],
    relatedTools: ['jpg-to-pdf', 'pdf-compress', 'image-to-pdf', 'photo-to-jpg', 'photo-compress']
  },

  // 19. PDF COMPRESS
  {
    id: 'pdf-compress',
    path: '/tools/pdf-compress',
    category: 'pdf',
    categoryTitle: 'PDF & Document Tools',
    categoryTitleTa: 'PDF & ஆவணக் கருவிகள்',
    title: 'PDF Compressor Online – Compress PDF Size under 100 KB / 200 KB | AK e-Sevai',
    titleTa: 'PDF கம்ப்ரஸர் ஆன்லைன் – PDF அளவை 100 KB-க்குள் குறைக்க | AK e-Sevai',
    description: 'Compress PDF files online to 100 KB, 200 KB or 500 KB for government portal uploads, Tamil Nadu e-Sevai certificates, and job applications.',
    descriptionTa: 'அரசு இ-சேவை சான்றிதழ்கள் மற்றும் தேர்வு இணையதளங்களில் பதிவேற்ற PDF கோப்புகளை 100 KB, 200 KB அல்லது 500 KB அளவிற்கு சுருக்குங்கள்.',
    keywords: 'pdf compressor, compress pdf online, reduce pdf size, pdf size reducer, compress pdf under 100kb, pdf compress செய்ய, reduce pdf size online',
    mode: 'pdf-compress',
    icon: 'Shrink',
    badge: '100 KB / 200 KB PDF Target',
    badgeTa: '100 KB / 200 KB இலக்கு',
    shortDesc: 'Reduce heavy PDF file sizes to under 100 KB or 200 KB for seamless portal uploads.',
    shortDescTa: 'அரசு இணையதளங்களுக்காக கனமான PDF கோப்புகளின் அளவை 100 KB-க்குள் சுருக்கவும்.',
    defaultTargetKb: 100,
    faqs: [
      {
        q: 'How to compress PDF under 100 KB for Tamil Nadu e-District portal?',
        qTa: 'தமிழ்நாடு இ-மாவட்ட தளத்திற்காக PDF-ஐ 100 KB-க்குள் சுருக்குவது எப்படி?',
        a: 'Upload your PDF, select the "100 KB Target" compression mode, and our engine automatically re-samples pages to stay under 100 KB while keeping text readable.',
        aTa: 'PDF-ஐ பதிவேற்றி "100 KB Target" என்பதை தேர்வு செய்தால், எழுத்துக்கள் அழியாமல் தானாக 100 KB-க்குள் சுருக்கி தரும்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload PDF Document', titleTa: 'PDF-ஐ பதிவேற்றவும்', text: 'Select the PDF file that is too large to upload.', textTa: 'அளவு அதிகமாக உள்ள PDF கோப்பை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Choose Compression Level', titleTa: 'சுருக்கும் அளவை தேர்வு செய்யவும்', text: 'Pick Under 100 KB, Under 200 KB, or 50% Reduction.', textTa: '100 KB அல்லது 200 KB இலக்கைத் தேர்ந்தெடுக்கவும்.' },
      { step: 3, title: 'Download Compact PDF', titleTa: 'சுருக்கிய PDF-ஐ பதிவிறக்கவும்', text: 'Save your compressed PDF ready for portal submission.', textTa: 'இணையதளத்தில் பதிவேற்ற தயாரான சிறிய PDF-ஐ சேமிக்கவும்.' }
    ],
    relatedTools: ['jpg-to-pdf', 'image-to-pdf', 'pdf-to-jpg', 'photo-compress-100kb', 'photo-compress']
  }
];

// ============================================================================
// SEARCH INTENT TOOL ALIASES & DEDICATED SEO VARIATIONS
// ============================================================================
export const SEARCH_INTENT_TOOL_ALIASES = {
  'passport-size-photo-maker': {
    parentId: 'passport-size-photo',
    title: 'Passport Size Photo Maker Online (3.5x4.5 cm) – Free Photo Studio | AK e-Sevai',
    titleTa: 'பாஸ்போர்ட் சைஸ் போட்டோ மேக்கர் ஆன்லைன் (3.5x4.5 cm) | AK e-Sevai',
    description: 'Create official 3.5 x 4.5 cm (35 x 45 mm) passport size photos online. Generate 4x6 (8 copies) and A4 (30+ copies) printable sheets with borders, name & date stamps. Free & 100% private.',
    descriptionTa: 'அரசு அங்கீகரிக்கப்பட்ட 3.5 x 4.5 cm பாஸ்போர்ட் சைஸ் போட்டோக்களை ஆன்லைனில் உருவாக்குங்கள். 4x6 மற்றும் A4 அச்சிடும் தாள்கள், பார்டர் மற்றும் பெயர்/தேதியுடன் இலவசமாக தயார் செய்யுங்கள்.',
    keywords: 'passport size photo maker, passport size photo online, passport size photo 35x45, passport size photo maker online, passport photo maker',
    canonical: 'https://www.akesevai.com/tools/passport-size-photo-maker'
  },
  'passport-photo-maker': {
    parentId: 'passport-size-photo',
    title: 'Passport Photo Maker Online – 3.5 x 4.5 cm Photo Studio | AK e-Sevai',
    titleTa: 'பாஸ்போர்ட் போட்டோ மேக்கர் ஆன்லைன் | AK e-Sevai',
    description: 'Free online passport photo maker for government exam forms, TNPSC, UPSC, SSC, and Tamil Nadu e-Sevai applications.',
    descriptionTa: 'அரசுத் தேர்வுகள் மற்றும் இ-சேவை விண்ணப்பங்களுக்கான பாஸ்போர்ட் போட்டோ மேக்கர்.',
    keywords: 'passport photo maker, passport photo maker online, photo maker for passport',
    canonical: 'https://www.akesevai.com/tools/passport-photo-maker'
  },
  'passport-photo-online': {
    parentId: 'passport-size-photo',
    title: 'Passport Photo Online Maker & Printable Sheet Creator | AK e-Sevai',
    titleTa: 'பாஸ்போர்ட் போட்டோ ஆன்லைன் மேக்கர் | AK e-Sevai',
    description: 'Make passport photos online with instant 4x6 and A4 multi-photo printable layout. 100% free and studio quality.',
    descriptionTa: 'ஆன்லைனில் பாஸ்போர்ட் போட்டோ தயார் செய்து 4x6 மற்றும் A4 தாள்களில் உடனடியாக அச்சிடுங்கள்.',
    keywords: 'passport photo online, make passport photo online, passport photo generator',
    canonical: 'https://www.akesevai.com/tools/passport-photo-online'
  },
  'passport-photo-crop': {
    parentId: 'photo-crop',
    title: 'Passport Photo Crop Online – 3.5x4.5 cm Crop Tool | AK e-Sevai',
    titleTa: 'பாஸ்போர்ட் போட்டோ க்ராப் ஆன்லைன் (3.5x4.5 cm) | AK e-Sevai',
    description: 'Crop passport photos to exact 3.5 x 4.5 cm (35x45 mm) aspect ratio online for government applications, TNPSC, SSC and UPSC forms.',
    descriptionTa: 'புகைப்படங்களை 3.5 x 4.5 செ.மீ பாஸ்போர்ட் அளவிற்கு துல்லியமாக வெட்டி க்ராப் செய்யுங்கள். அரசுத் தேர்வு மற்றும் சான்றிதழ் விண்ணப்பங்களுக்கு ஏற்றது.',
    keywords: 'passport photo crop, crop passport photo online, passport photo cropper, 35x45 photo crop',
    canonical: 'https://www.akesevai.com/tools/passport-photo-crop',
    overrideMode: 'crop',
    defaultAspect: 3.5 / 4.5
  },
  'photo-compressor': {
    parentId: 'photo-compress',
    title: 'Photo Compressor Online – Reduce Image Size in KB | AK e-Sevai',
    titleTa: 'போட்டோ கம்ப்ரஸர் ஆன்லைன் – போட்டோ அளவை KB-யில் குறைக்க | AK e-Sevai',
    description: 'Compress JPG, PNG, WEBP images online without losing visual quality. Reduce photo size in KB or MB with dynamic quality sliders.',
    descriptionTa: 'JPG, PNG மற்றும் WEBP படங்களின் தெளிவுத்திறன் குறையாமல் அவற்றின் அளவை KB மற்றும் MB-யில் ஆன்லைனில் விரைவாக குறையுங்கள்.',
    keywords: 'photo compressor, compress photo online, photo size reducer, compress image online, photo compressor online',
    canonical: 'https://www.akesevai.com/tools/photo-compressor'
  },
  'image-compressor': {
    parentId: 'photo-compress',
    title: 'Image Compressor Online – Fast Image Size Reducer | AK e-Sevai',
    titleTa: 'இமேஜ் கம்ப்ரஸர் ஆன்லைன் – போட்டோ அளவை குறைக்க | AK e-Sevai',
    description: 'Free image compressor to reduce JPG, PNG, and WEBP file size online with zero quality loss.',
    descriptionTa: 'படங்களின் அளவை உடனடியாகக் குறைக்கும் இலவச ஆன்லைன் இமேஜ் கம்ப்ரஸர்.',
    keywords: 'image compressor, image compressor online, compress image to kb, image size reducer',
    canonical: 'https://www.akesevai.com/tools/image-compressor'
  },
  'compress-image-to-100kb': {
    parentId: 'photo-compress-100kb',
    title: 'Compress Image to 100KB Online – Free 100 KB Photo Reducer | AK e-Sevai',
    titleTa: 'படத்தை 100KB-க்கு குறைக்க – ஆன்லைன் 100 KB போட்டோ கம்ப்ரஸர் | AK e-Sevai',
    description: 'Compress image to 100KB online for Tamil Nadu e-Sevai certificate uploads, Aadhaar, Ration Card and exam portals.',
    descriptionTa: 'படங்களை 100 KB அளவிற்கு சுருக்கி பதிவிறக்கம் செய்யுங்கள். அரசு இ-சேவை சான்றிதழ்கள் மற்றும் அடையாள அட்டை பதிவேற்றங்களுக்கு ஏற்றது.',
    keywords: 'compress image to 100kb, 100kb photo compressor, image compressor 100kb, photo compress to 100kb, compress photo 100kb',
    canonical: 'https://www.akesevai.com/tools/compress-image-to-100kb'
  },
  'image-compressor-100kb': {
    parentId: 'photo-compress-100kb',
    title: 'Image Compressor 100KB – Compress Photos under 100 KB | AK e-Sevai',
    titleTa: 'இமேஜ் கம்ப்ரஸர் 100KB – போட்டோவை 100 KB-க்குள் குறைக்க | AK e-Sevai',
    description: 'Compress JPG and PNG images strictly under 100 KB online with real-time size preview.',
    descriptionTa: 'JPG மற்றும் PNG படங்களை 100 KB-க்குள் சுருக்கும் ஆன்லைன் கருவி.',
    keywords: 'image compressor 100kb, compress image to 100 kb, reduce photo to 100kb',
    canonical: 'https://www.akesevai.com/tools/image-compressor-100kb'
  },
  '100kb-photo-compressor': {
    parentId: 'photo-compress-100kb',
    title: '100KB Photo Compressor Online – Fast 100 KB Image Size Reducer | AK e-Sevai',
    titleTa: '100KB போட்டோ கம்ப்ரஸர் ஆன்லைன் | AK e-Sevai',
    description: 'Fast 100KB photo compressor for government job forms, revenue certificates, and e-Sevai document vault.',
    descriptionTa: 'அரசு வேலைவாய்ப்பு மற்றும் இ-சேவை ஆவணங்களுக்கான 100KB போட்டோ கம்ப்ரஸர்.',
    keywords: '100kb photo compressor, photo compressor 100kb, compress photo 100kb',
    canonical: 'https://www.akesevai.com/tools/100kb-photo-compressor'
  },
  'compress-image-to-50kb': {
    parentId: 'photo-compress-50kb',
    title: 'Compress Image to 50KB Online – TNPSC & SSC Photo Reducer | AK e-Sevai',
    titleTa: 'படத்தை 50KB-க்கு குறைக்க – TNPSC & SSC போட்டோ கம்ப்ரஸர் | AK e-Sevai',
    description: 'Compress passport photos under 50 KB online for TNPSC, SSC, Railway RRB, and exam forms.',
    descriptionTa: 'புகைப்படங்களை சரியாக 50 KB-க்குள் இருக்கும்படி ஆன்லைனில் கம்ப்ரஸ் செய்யுங்கள்.',
    keywords: 'compress image to 50kb, photo compress to 50kb, 50kb photo compressor, compress photo 50kb',
    canonical: 'https://www.akesevai.com/tools/compress-image-to-50kb'
  },
  'compress-image-to-20kb': {
    parentId: 'photo-compress-20kb',
    title: 'Compress Image to 20KB Online – Signature & Photo Reducer | AK e-Sevai',
    titleTa: 'படத்தை 20KB-க்கு குறைக்க – கையொப்பம் & போட்டோ கம்ப்ரஸர் | AK e-Sevai',
    description: 'Compress signature and photo to 20 KB online for government exam applications and hall ticket portals.',
    descriptionTa: 'கையொப்பம் மற்றும் புகைப்படங்களை சரியாக 20 KB அல்லது 20 KB-க்குள் இருக்கும்படி ஆன்லைனில் சுருக்குங்கள்.',
    keywords: 'compress image to 20kb, signature compress 20kb, photo compress to 20kb, compress photo 20kb',
    canonical: 'https://www.akesevai.com/tools/compress-image-to-20kb'
  },
  'photo-resize': {
    parentId: 'photo-resizer',
    title: 'Photo Resize Online – Change Image Dimensions & Pixels | AK e-Sevai',
    titleTa: 'போட்டோ ரீசைஸ் ஆன்லைன் – பிக்சல் அளவு மாற்ற | AK e-Sevai',
    description: 'Resize image dimensions in pixels (width x height), centimeters, inches or percentages with aspect ratio lock.',
    descriptionTa: 'படங்களின் நீள அகலங்களை பிக்சல், சென்டிமீட்டர், இன்ச் அல்லது சதவீத அளவில் மாற்றி சேமியுங்கள்.',
    keywords: 'photo resize, photo resize online, resize photo online, image resize',
    canonical: 'https://www.akesevai.com/tools/photo-resize'
  },
  'online-photo-editor': {
    parentId: 'photo-editor',
    title: 'Online Photo Editor – Brightness, Contrast & Studio Filters | AK e-Sevai',
    titleTa: 'ஆன்லைன் போட்டோ எடிட்டர் – வெளிச்சம் & நிறத்தை மேம்படுத்த | AK e-Sevai',
    description: 'Edit photos online with brightness, contrast, saturation, sharpness, rotation, and studio enhancement filters.',
    descriptionTa: 'புகைப்படங்களின் வெளிச்சம், கான்ட்ராஸ்ட், நிறச்செறிவு மற்றும் ஸ்டுடியோ பில்டர்களை ஆன்லைனில் மாற்றுங்கள்.',
    keywords: 'online photo editor, photo editor online, edit photo online',
    canonical: 'https://www.akesevai.com/tools/online-photo-editor'
  },
  'passport-photo-background-change': {
    parentId: 'photo-background-change',
    title: 'Passport Photo Background Changer – White & Light Blue Background | AK e-Sevai',
    titleTa: 'பாஸ்போர்ட் போட்டோ பின்னணி நிறம் மாற்ற – வெள்ளை, வெளிர் நீலம் | AK e-Sevai',
    description: 'Change passport photo background color to official white, light blue, or studio colors online.',
    descriptionTa: 'பாஸ்போர்ட் மற்றும் அரசுத் தேர்வு விதிகளின்படி புகைப்படத்தின் பின்னணி நிறத்தை வெள்ளை அல்லது வெளிர் நீலமாக மாற்றுங்கள்.',
    keywords: 'passport photo background change, passport photo background light blue, change passport photo background to white',
    canonical: 'https://www.akesevai.com/tools/passport-photo-background-change'
  },
  'photo-background-editor': {
    parentId: 'photo-background-change',
    title: 'Photo Background Editor – Change & Color Background Online | AK e-Sevai',
    titleTa: 'போட்டோ பின்னணி எடிட்டர் | AK e-Sevai',
    description: 'Edit and replace photo background colors with standard studio colors online.',
    descriptionTa: 'புகைப்படத்தின் பின்னணி நிறத்தை மாற்றும் எளிய ஆன்லைன் எடிட்டர்.',
    keywords: 'photo background editor, change photo background online',
    canonical: 'https://www.akesevai.com/tools/photo-background-editor'
  },
  'webp-to-jpg': {
    parentId: 'photo-to-jpg',
    title: 'WEBP to JPG Converter Online – Fast Image Conversion | AK e-Sevai',
    titleTa: 'WEBP-ஐ JPG-ஆக மாற்ற – ஆன்லைன் கன்வெர்ட்டர் | AK e-Sevai',
    description: 'Convert modern WEBP images to universally accepted JPG format online with customizable quality.',
    descriptionTa: 'WEBP வடிவ படங்களை அனைத்து அரசு போர்ட்டல்களும் ஏற்கும் JPG வடிவத்திற்கு உடனடியாக மாற்றுங்கள்.',
    keywords: 'webp to jpg, convert webp to jpg, webp to jpg converter online',
    canonical: 'https://www.akesevai.com/tools/webp-to-jpg'
  },
  'photo-format-converter': {
    parentId: 'photo-to-jpg',
    title: 'Photo Format Converter Online – Convert JPG, PNG, WEBP, BMP | AK e-Sevai',
    titleTa: 'போட்டோ பார்மட் கன்வெர்ட்டர் ஆன்லைன் | AK e-Sevai',
    description: 'Universal image format converter to convert between JPG, PNG, WEBP, and BMP online with zero quality loss.',
    descriptionTa: 'எந்த பட வடிவத்தையும் JPG அல்லது PNG வடிவத்திற்கு எளிதாக மாற்றும் கருவி.',
    keywords: 'photo format converter, image format converter, convert photo format',
    canonical: 'https://www.akesevai.com/tools/photo-format-converter'
  },
  'pdf-maker': {
    parentId: 'image-to-pdf',
    title: 'PDF Maker Online – Create PDF from Photos & Documents | AK e-Sevai',
    titleTa: 'PDF மேக்கர் ஆன்லைன் – படங்களிலிருந்து PDF ஆவணம் உருவாக்க | AK e-Sevai',
    description: 'Create and generate A4 PDF documents from photos, scanned pages, and receipts online.',
    descriptionTa: 'புகைப்படங்கள் மற்றும் ஆவணப் படங்களை அச்சிடத்தக்க A4 PDF ஆவணமாக ஆன்லைனில் மாற்றுங்கள்.',
    keywords: 'pdf maker, pdf maker online, make pdf from images, photo to pdf maker',
    canonical: 'https://www.akesevai.com/tools/pdf-maker'
  },
  'pdf-compressor': {
    parentId: 'pdf-compress',
    title: 'PDF Compressor Online – Compress PDF Size under 100 KB / 200 KB | AK e-Sevai',
    titleTa: 'PDF கம்ப்ரஸர் ஆன்லைன் – PDF அளவை குறைக்க | AK e-Sevai',
    description: 'Compress PDF files online to 100 KB, 200 KB or 500 KB for government portal uploads and e-Sevai certificates.',
    descriptionTa: 'அரசு இ-சேவை சான்றிதழ்கள் மற்றும் தேர்வு இணையதளங்களில் பதிவேற்ற PDF கோப்புகளை 100 KB அல்லது 200 KB அளவிற்கு சுருக்குங்கள்.',
    keywords: 'pdf compressor, compress pdf online, reduce pdf size, pdf size reducer',
    canonical: 'https://www.akesevai.com/tools/pdf-compressor'
  }
};

// Helper to look up tool by ID or route pathname (with full alias support)
export function getToolBySlugOrId(identifier) {
  if (!identifier) return null;
  const clean = String(identifier).replace(/^\/+/, '').replace(/^tools\//, '').replace(/\/$/, '').toLowerCase();
  
  // 1. Direct Catalog Match
  const direct = PHOTO_TOOLS_CATALOG.find(t => t.id === clean || t.path === `/${clean}` || t.path === `/tools/${clean}`);
  if (direct) return direct;

  // 2. Search Intent Alias Match
  if (SEARCH_INTENT_TOOL_ALIASES[clean]) {
    const aliasInfo = SEARCH_INTENT_TOOL_ALIASES[clean];
    const parent = PHOTO_TOOLS_CATALOG.find(t => t.id === aliasInfo.parentId);
    if (parent) {
      return {
        ...parent,
        id: clean,
        path: `/tools/${clean}`,
        title: aliasInfo.title,
        titleTa: aliasInfo.titleTa,
        description: aliasInfo.description,
        descriptionTa: aliasInfo.descriptionTa,
        keywords: aliasInfo.keywords,
        canonical: aliasInfo.canonical,
        ...(aliasInfo.overrideMode ? { mode: aliasInfo.overrideMode } : {}),
        ...(aliasInfo.defaultAspect ? { presetSizes: [{ label: 'Passport 3.5:4.5', aspect: aliasInfo.defaultAspect, name: 'Passport 3.5:4.5' }, ...(parent.presetSizes || [])] } : {})
      };
    }
  }

  return null;
}

// Grouped categories for the Content Hub (/photo-tools)
export const PHOTO_TOOLS_CATEGORIES = [
  {
    id: 'passport',
    title: 'Passport & Identity Studio',
    titleTa: 'பாஸ்போர்ட் & அடையாள அட்டை கருவிகள்',
    desc: 'Make official 3.5x4.5 cm passport photos, resize for government exams, and print 4x6 / A4 photo sheets.',
    descTa: 'அரசு அங்கீகரிக்கப்பட்ட பாஸ்போர்ட் போட்டோக்கள் மற்றும் 4x6 / A4 அச்சிடும் தாள்களை தயார் செய்யுங்கள்.',
    toolIds: ['passport-size-photo', 'passport-photo-resize', 'photo-crop']
  },
  {
    id: 'compression',
    title: 'Precision Photo Size Reducers',
    titleTa: 'புகைப்பட அளவு குறைப்பான் (KB)',
    desc: 'Compress images strictly under 20 KB, 50 KB, or 100 KB with instant before/after size previews.',
    descTa: 'புகைப்படங்களை சரியாக 20 KB, 50 KB அல்லது 100 KB அளவிற்கு தரம் குறையாமல் சுருக்குங்கள்.',
    toolIds: ['photo-compress', 'photo-compress-20kb', 'photo-compress-50kb', 'photo-compress-100kb']
  },
  {
    id: 'crop-resize',
    title: 'Crop & Dimension Resizers',
    titleTa: 'க்ராப் & பிக்சல் அளவீடு கருவிகள்',
    desc: 'Crop to passport, square, or signature ratios and resize pixel width × height with DPI controls.',
    descTa: 'போட்டோக்களை தேவையான நீள அகல பிக்சல்களுக்கு மாற்றி துல்லியமாக வெட்டி எடுங்கள்.',
    toolIds: ['photo-crop', 'photo-resizer', 'passport-photo-resize']
  },
  {
    id: 'editor',
    title: 'Photo Enhancer & Backgrounds',
    titleTa: 'போட்டோ எடிட்டிங் & பின்னணி நிறம்',
    desc: 'Brighten dark photos, enhance clarity, and change background to official white or light blue.',
    descTa: 'வெளிச்சத்தை அதிகரித்து, பின்னணி நிறத்தை பாஸ்போர்ட் வெள்ளை அல்லது நீலமாக மாற்றுங்கள்.',
    toolIds: ['photo-editor', 'photo-background-change']
  },
  {
    id: 'converter',
    title: 'Image Format Converters',
    titleTa: 'பட வடிவ மாற்றிகள் (JPG / PNG)',
    desc: 'Convert any image between JPG, PNG, WEBP, and BMP with lossless quality.',
    descTa: 'JPG, PNG மற்றும் WEBP படங்களை ஒன்றுக்கொன்று உடனடியாக மாற்றிக் கொள்ளுங்கள்.',
    toolIds: ['photo-to-jpg', 'photo-to-png', 'jpg-to-png', 'png-to-jpg']
  },
  {
    id: 'pdf',
    title: 'PDF & Document Converters',
    titleTa: 'PDF & ஆவணக் கருவிகள்',
    desc: 'Convert JPG/PNG to A4 PDF, merge multi-image documents, extract PDF to JPG, and compress PDFs.',
    descTa: 'படங்களை A4 PDF ஆவணமாக மாற்றவும், பல படங்களை இணைக்கவும் மற்றும் PDF அளவை குறைக்கவும் உதவும் கருவிகள்.',
    toolIds: ['jpg-to-pdf', 'png-to-pdf', 'image-to-pdf', 'pdf-to-jpg', 'pdf-compress']
  }
];

// Exam photo guidelines matrix
export const EXAM_PHOTO_GUIDELINES = [
  {
    exam: 'TNPSC Group 4 / 2 / VAO',
    examTa: 'TNPSC குரூப் 4 / 2 / VAO',
    photoSpec: '3.5 cm × 4.5 cm (20 KB – 50 KB) with Name & Date Stamp',
    sigSpec: '2.0 cm × 1.0 cm (10 KB – 20 KB)',
    note: 'Check the official TNPSC notification before uploading.',
    noteTa: 'பதிவேற்றும் முன் அதிகாரப்பூர்வ TNPSC அறிவிப்பை சரிபார்க்கவும்.'
  },
  {
    exam: 'Staff Selection Commission (SSC CGL / CHSL)',
    examTa: 'பணியாளர் தேர்வாணையம் (SSC)',
    photoSpec: '3.5 cm × 4.5 cm (20 KB – 50 KB) without spectacles',
    sigSpec: '4.0 cm × 2.0 cm (10 KB – 20 KB)',
    note: 'Check the official SSC notification before uploading.',
    noteTa: 'பதிவேற்றும் முன் அதிகாரப்பூர்வ SSC அறிவிப்பை சரிபார்க்கவும்.'
  },
  {
    exam: 'UPSC Civil Services / NDA / CDS',
    examTa: 'மத்திய அரசு (UPSC)',
    photoSpec: '350 × 350 px (20 KB – 300 KB) plain white background',
    sigSpec: '350 × 350 px (20 KB – 300 KB)',
    note: 'Check the official UPSC notification before uploading.',
    noteTa: 'பதிவேற்றும் முன் அதிகாரப்பூர்வ UPSC அறிவிப்பை சரிபார்க்கவும்.'
  },
  {
    exam: 'Banking & IBPS / SBI PO & Clerk',
    examTa: 'வங்கி தேர்வுகள் (IBPS / SBI)',
    photoSpec: '4.5 cm × 3.5 cm (20 KB – 50 KB) clear passport photo',
    sigSpec: '10 KB – 20 KB (Black ink on white paper)',
    note: 'Check the official IBPS/SBI notification before uploading.',
    noteTa: 'பதிவேற்றும் முன் அதிகாரப்பூர்வ வங்கி தேர்வு அறிவிப்பை சரிபார்க்கவும்.'
  },
  {
    exam: 'Railway Recruitment Board (RRB NTPC)',
    examTa: 'ரயில்வே தேர்வுகள் (RRB NTPC)',
    photoSpec: '35 mm × 45 mm (30 KB – 70 KB) color photograph',
    sigSpec: '30 KB – 70 KB (Black / Blue ink)',
    note: 'Check the official RRB notification before uploading.',
    noteTa: 'பதிவேற்றும் முன் அதிகாரப்பூர்வ RRB அறிவிப்பை சரிபார்க்கவும்.'
  },
  {
    exam: 'TN e-Sevai Certificate Vault',
    examTa: 'தமிழ்நாடு இ-சேவை சான்றிதழ்கள்',
    photoSpec: 'Passport size photo ≤ 50 KB (Income, Community, Nativity)',
    sigSpec: 'Applicant / Parent signature ≤ 20 KB',
    note: 'Check official e-District portal requirements before uploading.',
    noteTa: 'பதிவேற்றும் முன் அரசு இ-மாவட்ட தளம் விதிகளை சரிபார்க்கவும்.'
  }
];
