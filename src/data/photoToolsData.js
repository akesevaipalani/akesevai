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
    title: 'Passport Size Photo Maker Online (3.5x4.5 cm / 2x2 in) | AK E-SEVAI',
    titleTa: 'பாஸ்போர்ட் சைஸ் போட்டோ மேக்கர் ஆன்லைன் (3.5x4.5 cm) | AK E-SEVAI',
    description: 'Create 3.5 x 4.5 cm (35 x 45 mm) and 2 x 2 inch passport-style photos online across Tamil Nadu. Generate 4x6 (8 copies) and A4 printable sheets locally in your browser. Verify exact portal rules before submission.',
    descriptionTa: 'பாஸ்போர்ட் அளவு (3.5 x 4.5 cm) மற்றும் 4x6 / A4 அச்சிடும் தாள்களை உங்கள் பிரவுசரிலேயே இலவசமாக உருவாக்குங்கள். பழனியில் நேரடி அச்சு வசதியும், தமிழ்நாடு முழுவதும் ஆன்லைன் பயன்பாட்டிற்கும் உகந்தது. பதிவேற்றும் முன் அதிகாரப்பூர்வ விதிகளை சரிபார்க்கவும்.',
    keywords: 'passport size photo maker, passport size photo online, passport size photo 35x45, passport photo 3.5 x 4.5 cm, passport size photo செய்ய, passport size photo online maker, passport sheet maker, akesevai passport photo, palani passport photo studio',
    mode: 'passport',
    icon: 'Camera',
    badge: 'Official 3.5 × 4.5 cm',
    badgeTa: 'அரசு 3.5 × 4.5 செ.மீ',
    shortDesc: 'Create single passport photos or 4x6 / A4 printable multi-photo sheets with border, name stamp, and instant print support.',
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
        a: 'The standard passport size photo dimension in India is 3.5 cm (width) x 4.5 cm (height) or 35 mm x 45 mm, corresponding to 350 x 450 pixels (or 413 x 531 pixels at 300 DPI).',
        aTa: 'இந்தியாவில் வழக்கமான பாஸ்போர்ட் போட்டோவின் அளவு 3.5 செ.மீ (அகலம்) x 4.5 செ.மீ (உயரம்) அல்லது 35 மி.மீ x 45 மி.மீ (350 x 450 பிக்சல்கள்) ஆகும்.'
      },
      {
        q: 'How many photos can I print on a 4x6 or A4 photo sheet?',
        qTa: '4x6 அல்லது A4 தாளில் எத்தனை பாஸ்போர்ட் போட்டோக்களை அச்சிடலாம்?',
        a: 'Our tool automatically arranges 8 photos on a standard 4x6 inch sheet, and up to 32–36 photos on an A4 sheet with proper cutting guidelines and borders.',
        aTa: 'எங்கள் கருவி மூலம் 4x6 தாளில் 8 போட்டோக்களையும், A4 தாளில் 32 முதல் 36 போட்டோக்களையும் வெட்டுவதற்கான பார்டருடன் எளிதாக அச்சிடலாம்.'
      },
      {
        q: 'Can I get physical photo printouts in Palani?',
        qTa: 'பழனியில் நேரடியாக போட்டோ பிரிண்ட் அவுட் பெற முடியுமா?',
        a: 'Yes! After creating your sheet, you can visit our physical centre at AK E-SEVAI, Mill Road (opposite Palani Bus Stand) for instant glossy photo printing on 200+ GSM paper.',
        aTa: 'ஆம்! உங்கள் போட்டோ ஷீட்டை தயார் செய்த பிறகு, பழனி பஸ் ஸ்டாண்ட் எதிரில் உள்ள மில் ரோடு AK E-SEVAI மையத்தில் உடனே உயர்தர போட்டோ பேப்பரில் பிரிண்ட் அவுட் பெற்றுக்கொள்ளலாம்.'
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
    relatedTools: ['signature-resize', 'passport-photo-resize', 'photo-crop', 'photo-compress-50kb', 'photo-background-change', 'jpg-to-pdf']
  },

  // 1B. SIGNATURE RESIZE & COMPRESSOR (GOVERNMENT EXAMS)
  {
    id: 'signature-resize',
    path: '/tools/signature-resize',
    category: 'crop-resize',
    categoryTitle: 'Crop & Resize Tools',
    categoryTitleTa: 'க்ராப் & ரீசைஸ் கருவிகள்',
    title: 'Signature Resize & Compressor Online (Under 20 KB) | AK E-SEVAI',
    titleTa: 'கையொப்பம் ரீசைஸ் & கம்ப்ரஸர் ஆன்லைன் (20 KB-க்குள்) | AK E-SEVAI',
    description: 'Resize and compress signature images locally in your browser to target under 20 KB (configurable width/height presets like 200x100 px or 140x60 px) for online applications across Tamil Nadu. Verify exact notification rules before uploading.',
    descriptionTa: 'கையொப்பப் படத்தை 20 KB-க்குள் (200x100 அல்லது 140x60 பிக்சல் விருப்பங்களுடன்) உங்கள் பிரவுசரிலேயே பாதுகாப்பாக சுருக்குங்கள். பதிவேற்றும் முன் தேர்வு அறிவிப்பின் அதிகாரப்பூர்வ விதிகளை சரிபார்க்கவும்.',
    keywords: 'signature resize, signature resize online, signature compress 20kb, crop signature online, tnpsc signature resize, signature resize செய்ய, ssc signature 20kb, akesevai signature tool',
    mode: 'signature-compress',
    icon: 'PenTool',
    badge: 'Govt Exam 2:1 Ratio (20 KB)',
    badgeTa: 'அரசு தேர்வு 2:1 அளவு (20 KB)',
    shortDesc: 'Crop & compress signatures to exact 2:1 ratio (200x100 px) under 20 KB for TNPSC, SSC, and govt exams.',
    shortDescTa: 'கையொப்பங்களை 2:1 விகிதத்தில் 20 KB-க்குள் சுருக்கி அரசுத் தேர்வுகளுக்குத் தயார் செய்யுங்கள்.',
    defaultTargetKb: 20,
    defaultAspect: 2 / 1,
    presetSizes: [
      { label: 'Government Exam Signature (200 × 100 px / 2:1 ratio)', w: 200, h: 100, targetKb: 20, name: 'Signature 2:1', aspect: 2 },
      { label: 'TNPSC Signature (200 × 100 px, 10–20 KB)', w: 200, h: 100, targetKb: 20, name: 'TNPSC Sig', aspect: 2 },
      { label: 'SSC Signature (140 × 60 px, 10–20 KB)', w: 140, h: 60, targetKb: 20, name: 'SSC Sig', aspect: 2.33 },
      { label: 'Bank / IBPS Signature (140 × 60 px, 10–20 KB)', w: 140, h: 60, targetKb: 20, name: 'IBPS Sig', aspect: 2.33 }
    ],
    faqs: [
      {
        q: 'What is the standard signature size for government online applications?',
        qTa: 'அரசு ஆன்லைன் விண்ணப்பங்களுக்கான வழக்கமான கையொப்ப அளவு என்ன?',
        a: 'Most government portals including TNPSC and SSC require a signature image with a 2:1 or 2.3:1 aspect ratio (typically 200 x 100 pixels or 140 x 60 pixels) and a file size strictly between 10 KB and 20 KB.',
        aTa: 'TNPSC மற்றும் SSC உள்ளிட்ட பெரும்பாலான அரசு இணையதளங்களில் கையொப்ப படம் 2:1 அல்லது 2.3:1 விகிதத்தில் (200x100 பிக்சல் அல்லது 140x60 பிக்சல்) மற்றும் 10 KB முதல் 20 KB அளவுக்குள் இருக்க வேண்டும்.'
      },
      {
        q: 'How can I get a clear signature image on plain paper?',
        qTa: 'வெள்ளை காகிதத்தில் தெளிவான கையொப்ப படம் எடுப்பது எப்படி?',
        a: 'Sign with a dark blue or black ballpoint/gel pen on unruled plain white paper. Take a photo in bright daylight without shadows, then upload it here to crop and compress.',
        aTa: 'கோடிடாத வெள்ளை காகிதத்தில் கருப்பு அல்லது நீல பேனாவால் கையொப்பமிடுங்கள். நிழல் விழாதவாறு வெளிச்சத்தில் படம் எடுத்து இங்கு பதிவேற்றி எளிதாக க்ராப் செய்யுங்கள்.'
      },
      {
        q: 'Is this signature tool safe and private?',
        qTa: 'இந்த கையொப்ப கருவி பாதுகாப்பானதா?',
        a: 'Yes, 100%. Your signature is cropped and compressed strictly inside your browser using HTML5 Canvas. It is never transmitted to any external server or saved anywhere.',
        aTa: 'முற்றிலும் பாதுகாப்பானது! உங்கள் கையொப்பம் உங்கள் பிரவுசரிலேயே HTML5 Canvas மூலம் சுருக்கப்படுகிறது. எந்த வெளி சர்வர்க்கும் அனுப்பப்படாது.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Signature Photo', titleTa: 'கையொப்பப் படத்தை பதிவேற்றவும்', text: 'Select your signature photo taken on plain white paper.', textTa: 'வெள்ளை தாளில் கையொப்பமிட்டு எடுத்த படத்தை பதிவேற்றவும்.' },
      { step: 2, title: 'Crop to 2:1 Box', titleTa: '2:1 பெட்டிக்குள் சரிசெய்யவும்', text: 'Adjust the rectangular crop handles to frame your signature neatly.', textTa: 'கையொப்பம் தெளிவாக தெரியும்படி செவ்வக பெட்டியை நகர்த்தி சரிசெய்யவும்.' },
      { step: 3, title: 'Download Under 20 KB', titleTa: '20 KB-க்குள் பதிவிறக்கவும்', text: 'Click Download to instantly get the optimized JPG under 20 KB ready for portal upload.', textTa: 'பதிவிறக்கு பட்டனை அழுத்தி 20 KB-க்குள் தயாரான JPG கோப்பை உடனே சேமிக்கவும்.' }
    ],
    relatedTools: ['passport-size-photo', 'photo-compress-20kb', 'photo-crop', 'passport-photo-resize', 'jpg-to-pdf']
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
    title: 'Compress Photo to 20 KB Online – Free Signature & Photo Reducer | AK E-SEVAI Palani',
    titleTa: 'போட்டோவை 20 KB-க்கு குறைக்க – ஆன்லைன் இமேஜ் கம்ப்ரஸர் | AK E-SEVAI பழனி',
    description: 'Compress signature and photo files to under 20 KB (10–20 KB) online for online job applications, entrance exams, and portal uploads. Free, fast & 100% private on-device compression.',
    descriptionTa: 'கையொப்பம் மற்றும் புகைப்படங்களை 20 KB-க்குள் (10–20 KB) இருக்கும்படி ஆன்லைனில் சுருக்குங்கள். அரசுத் தேர்வுகள் மற்றும் ஆன்லைன் விண்ணப்பங்களுக்கு ஏற்றது. 100% இலவசம் & பிரைவேட்.',
    keywords: 'compress photo to 20kb, photo compress to 20 kb, signature compress 20kb, reduce photo size to 20kb, photo 20 KB க்கு குறைக்க, signature resize 20kb, akesevai compress 20kb',
    mode: 'compress-target',
    icon: 'FileDigit',
    badge: 'Target: ≤ 20 KB',
    badgeTa: 'இலக்கு: ≤ 20 KB',
    shortDesc: 'Specialized compressor targeting under 20 KB for signatures and small photo uploads.',
    shortDescTa: 'விண்ணப்ப கையொப்பம் மற்றும் சிறு புகைப்படங்களை 20 KB-க்குள் சரியாக சுருக்கும் சிறப்புக் கருவி.',
    defaultTargetKb: 20,
    faqs: [
      {
        q: 'When should I compress photos or signatures to under 20 KB?',
        qTa: 'புகைப்படம் அல்லது கையொப்பத்தை 20 KB-க்குள் எப்போது சுருக்க வேண்டும்?',
        a: 'Many online application forms, job portals, and entrance exams specify a 20 KB maximum upload limit for signatures or small photos. Always check your specific application notification for exact requirements.',
        aTa: 'பல ஆன்லைன் விண்ணப்பங்கள் மற்றும் தேர்வு இணையதளங்கள் கையொப்பம் அல்லது சிறிய புகைப்படங்களுக்கு 20 KB அதிகபட்ச வரம்பை நிர்ணயிக்கின்றன. விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ வழிகாட்டுதலை சரிபார்க்கவும்.'
      },
      {
        q: 'Is my uploaded photo or signature saved on any server?',
        qTa: 'எனது படம் அல்லது கையொப்பம் சர்வரில் சேமிக்கப்படுகிறதா?',
        a: 'No. All image processing and compression runs 100% locally inside your web browser via HTML5 Canvas. Your personal files never leave your device.',
        aTa: 'இல்லை. அனைத்து கம்ப்ரஷனும் உங்கள் பிரவுசரிலேயே HTML5 Canvas மூலம் நடைபெறுகிறது. உங்கள் தனிப்பட்ட கோப்புகள் உங்கள் சாதனத்தை விட்டு வெளியேறாது.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Signature / Photo', titleTa: 'கையொப்பம் / போட்டோவை பதிவேற்றவும்', text: 'Select your photo or cropped signature image.', textTa: 'உங்கள் கையொப்பம் அல்லது புகைப்படத்தை பதிவேற்றவும்.' },
      { step: 2, title: 'Auto 20 KB Optimization', titleTa: '20 KB-க்குள் சுருக்குதல்', text: 'Engine automatically balances quality to ensure file size is strictly under 20 KB.', textTa: 'எங்கள் கருவி தானாகவே தெளிவு மாறாமல் 20 KB-க்குள் கோப்பை சுருக்கும்.' },
      { step: 3, title: 'Instant Download', titleTa: 'உடனடி பதிவிறக்கம்', text: 'Download the compressed file ready for portal upload.', textTa: 'விண்ணப்பத்தில் பதிவேற்ற தயாரான படத்தை சேமிக்கவும்.' }
    ],
    relatedTools: ['signature-resize', 'photo-compress-50kb', 'photo-compress-100kb', 'photo-crop', 'image-to-pdf']
  },

  // 6. PHOTO COMPRESS 50KB
  {
    id: 'photo-compress-50kb',
    path: '/tools/photo-compress-50kb',
    category: 'compression',
    categoryTitle: 'Compression Tools',
    categoryTitleTa: 'கம்ப்ரஷன் கருவிகள்',
    title: 'Compress Photo to 50 KB Online – Passport Photo Reducer | AK E-SEVAI Palani',
    titleTa: 'போட்டோவை 50 KB-க்கு குறைக்க – பாஸ்போர்ட் போட்டோ கம்ப்ரஸர் | AK E-SEVAI பழனி',
    description: 'Compress passport photos to under 50 KB online when application forms specify a 50 KB file size limit. Keeps facial features sharp with zero server upload.',
    descriptionTa: 'விண்ணப்ப படிவங்கள் 50 KB வரம்பைக் கோரும் போது புகைப்படங்களை 50 KB-க்குள் தரமாக சுருக்குங்கள். முகத்தின் தெளிவு மாறாமல் பிரவுசரிலேயே பாதுகாப்பாக நடைபெறுகிறது.',
    keywords: 'compress photo to 50kb, reduce photo to 50kb, image compressor 50kb, photo 50 kb size online, photo 50 KB க்கு குறைக்க, passport photo compress 50kb',
    mode: 'compress-target',
    icon: 'FileCheck',
    badge: 'Target: ≤ 50 KB',
    badgeTa: 'இலக்கு: ≤ 50 KB',
    shortDesc: 'Auto-compress passport photos under 50 KB with crisp facial clarity.',
    shortDescTa: 'பாஸ்போர்ட் புகைப்படங்களை முகம் தெளிவாக இருக்கும்படி 50 KB-க்குள் விரைவாக சுருக்கவும்.',
    defaultTargetKb: 50,
    faqs: [
      {
        q: 'Why do application portals specify a 50 KB limit for passport photos?',
        qTa: 'விண்ணப்பங்களில் பாஸ்போர்ட் போட்டோவிற்கு 50 KB வரம்பு ஏன் கேட்கப்படுகிறது?',
        a: 'Online portals often set a 50 KB ceiling to balance clear facial identification with fast upload speeds and efficient server storage. Always consult the official notification for exact form requirements.',
        aTa: 'இணையதளங்கள் வேகமான பரிசீலனை மற்றும் முகத் தெளிவிற்காக 50 KB வரம்பை வைக்கின்றன. விண்ணப்பிக்கும் முன் உங்கள் படிவத்தின் வழிகாட்டுதலை சரிபார்க்கவும்.'
      },
      {
        q: 'Will facial clarity remain sharp after compressing to 50 KB?',
        qTa: '50 KB-க்குள் சுருக்கும் போது முகம் தெளிவாக இருக்குமா?',
        a: 'Yes. Our smart client-side algorithm optimizes file binary data while preserving facial features and edge sharpness.',
        aTa: 'ஆம். எங்கள் கருவி புகைப்படத்தின் தரத்தை தக்கவைத்து அளவை மட்டுமே 50 KB-க்குள் குறைக்கிறது.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Photo', titleTa: 'புகைப்படத்தை பதிவேற்றவும்', text: 'Select your passport photo from your mobile or PC.', textTa: 'உங்கள் பாஸ்போர்ட் படத்தை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Smart 50 KB Compression', titleTa: '50 KB வரம்பிற்குள் சுருக்குதல்', text: 'Engine automatically reduces file size under 50 KB while preserving sharpness.', textTa: 'தெளிவு மாறாமல் கோப்பு அளவு 50 KB-க்குள் சுருக்கப்படுகிறது.' },
      { step: 3, title: 'Download & Apply', titleTa: 'பதிவிறக்கி பதிவேற்றவும்', text: 'Download the verified image and upload to your application portal.', textTa: 'பதிவிறக்கம் செய்து தேர்வு இணையதளத்தில் பதிவேற்றவும்.' }
    ],
    relatedTools: ['passport-size-photo', 'photo-compress-20kb', 'photo-compress-100kb', 'photo-crop', 'image-to-pdf']
  },

  // 7. PHOTO COMPRESS 100KB
  {
    id: 'photo-compress-100kb',
    path: '/tools/photo-compress-100kb',
    category: 'compression',
    categoryTitle: 'Compression Tools',
    categoryTitleTa: 'கம்ப்ரஷன் கருவிகள்',
    title: 'Compress Photo to 100 KB Online – Document & Photo Compressor | AK E-SEVAI Palani',
    titleTa: 'போட்டோவை 100 KB-க்கு குறைக்க – ஆவண & இமேஜ் கம்ப்ரஸர் | AK E-SEVAI பழனி',
    description: 'Compress scanned documents, certificates, and photos to under 100 KB online. Reduce file size quickly while keeping text legible for online form attachments.',
    descriptionTa: 'சான்றிதழ்கள், ஸ்கேன் செய்த ஆவணங்கள் மற்றும் புகைப்படங்களை 100 KB-க்குள் சுருக்குங்கள். எழுத்துக்கள் தெளிவாக இருக்கும்படி ஆன்லைன் விண்ணப்பங்களுக்கு ஏற்றவாறு மாற்றவும்.',
    keywords: 'compress photo to 100kb, compress image to 100kb, photo compressor under 100kb, reduce photo size under 100kb, photo 100 KB க்கு குறைக்க, image size 100kb',
    mode: 'compress-target',
    icon: 'FileSpreadsheet',
    badge: 'Target: ≤ 100 KB',
    badgeTa: 'இலக்கு: ≤ 100 KB',
    shortDesc: 'Compress photos & scanned document images strictly under 100 KB for form attachments.',
    shortDescTa: 'விண்ணப்ப ஆவண இணைப்புகளுக்காக படங்களை 100 KB-க்குள் சரியாக சுருக்கும் சிறப்புக் கருவி.',
    defaultTargetKb: 100,
    faqs: [
      {
        q: 'When should I compress documents or photos to under 100 KB?',
        qTa: 'ஆவணங்கள் அல்லது படங்களை 100 KB-க்குள் எப்போது சுருக்க வேண்டும்?',
        a: 'Use this tool when an online portal or form specifies a 100 KB file upload ceiling for supporting certificates, ID cards, or document attachments.',
        aTa: 'சான்றிதழ்கள், அடையாள அட்டைகள் அல்லது ஆவண இணைப்புகளுக்கு இணையதளங்கள் 100 KB வரம்பு நிர்ணயிக்கும் போது இந்த கருவியைப் பயன்படுத்தலாம்.'
      },
      {
        q: 'Is this document compressor private and secure?',
        qTa: 'இந்த ஆவண கம்ப்ரஸர் பாதுகாப்பானதா?',
        a: 'Yes, 100%. All processing is performed locally on your device via HTML5 Canvas. Your sensitive certificates and documents are never uploaded to any remote server.',
        aTa: 'முற்றிலும் பாதுகாப்பானது. உங்கள் சாதனத்திலேயே பிரவுசர் மூலம் ஆவணங்கள் சுருக்கப்படுகின்றன. எங்கும் பதிவேற்றப்படாது.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Scanned Photo / Doc', titleTa: 'ஆவணப் படத்தை பதிவேற்றவும்', text: 'Select your photo or scanned document image.', textTa: 'உங்கள் புகைப்படம் அல்லது ஸ்கேன் செய்த ஆவணத்தை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Auto 100 KB Reduction', titleTa: '100 KB-க்குள் குறைத்தல்', text: 'Optimizes file binary to stay strictly under 100 KB while keeping text readable.', textTa: 'எழுத்துக்கள் தெளிவாக இருக்கும்படி 100 KB-க்குள் கோப்பு அளவு சுருக்கப்படுகிறது.' },
      { step: 3, title: 'Download File', titleTa: 'கோப்பை பதிவிறக்கவும்', text: 'Download the optimized image ready for submission.', textTa: 'இணையதளத்தில் பதிவேற்ற தயாரான படத்தை சேமிக்கவும்.' }
    ],
    relatedTools: ['photo-compress-50kb', 'photo-compress-20kb', 'image-to-pdf', 'photo-crop', 'passport-size-photo']
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
    title: 'Image to PDF Converter Online – Merge Multiple Photos into PDF | AK E-SEVAI Palani',
    titleTa: 'இமேஜ் to PDF கன்வெர்ட்டர் – பல படங்களை ஒரே PDF-ஆக இணைக்க | AK E-SEVAI பழனி',
    description: 'Convert and merge JPG, PNG, and scanned photos into a clean A4 PDF document online. Select portrait or landscape layout, reorder pages, and download instantly.',
    descriptionTa: 'JPG, PNG மற்றும் ஸ்கேன் செய்த படங்களை A4 PDF ஆவணமாக இணைத்து பதிவிறக்குங்கள். போர்ட்ரெய்ட் / லேண்ட்ஸ்கேப் அமைத்து ஒரே PDF கோப்பாக சேமிக்கவும்.',
    keywords: 'image to pdf, photo to pdf, merge images to pdf, convert multiple photos to pdf, images to pdf online, photo pdf மாற்ற, image to pdf converter, akesevai image to pdf',
    mode: 'multi-image-to-pdf',
    icon: 'Combine',
    badge: 'Multi-Page A4 PDF',
    badgeTa: 'பல பக்க A4 PDF',
    shortDesc: 'Merge multiple JPG, PNG and scanned pages into a single printable A4 PDF document.',
    shortDescTa: 'பல படங்களை வரிசைப்படுத்தி ஒரே PDF கோப்பாக இணைத்து பதிவிறக்குங்கள்.',
    defaultTargetKb: 200,
    faqs: [
      {
        q: 'Can I combine multiple JPG and PNG images into a single PDF?',
        qTa: 'பல JPG மற்றும் PNG படங்களை ஒரே PDF-ஆக இணைக்க முடியுமா?',
        a: 'Yes. You can upload multiple JPG or PNG images, reorder the pages as needed, and export them into a single organized A4 PDF document.',
        aTa: 'ஆம். பல JPG மற்றும் PNG படங்களை பதிவேற்றி, பக்கங்களை வரிசைப்படுத்தி ஒரே A4 PDF ஆவணமாக எளிதாக இணைக்கலாம்.'
      },
      {
        q: 'Does Image to PDF upload files to any cloud server?',
        qTa: 'இந்த PDF கருவி கோப்புகளை சர்வரில் பதிவேற்றுகிறதா?',
        a: 'No. The PDF is assembled directly on your device using client-side jsPDF. Your images and documents remain 100% private.',
        aTa: 'இல்லை. உங்கள் பிரவுசரிலேயே jsPDF மூலம் PDF உருவாக்கப்படுகிறது. உங்கள் படங்கள் எங்கும் பகிரப்படாது.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Images', titleTa: 'படங்களை பதிவேற்றவும்', text: 'Select one or more JPG, PNG or WEBP images from your device.', textTa: 'ஒன்று அல்லது அதற்கு மேற்பட்ட படங்களை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Set Orientation & Margins', titleTa: 'அமைப்புகளை தேர்வு செய்யவும்', text: 'Choose A4 Portrait or Landscape and margin spacing.', textTa: 'A4 போர்ட்ரெய்ட் / லேண்ட்ஸ்கேப் மற்றும் மார்ஜின் அளவை தேர்வு செய்யவும்.' },
      { step: 3, title: 'Download Merged PDF', titleTa: 'இணைந்த PDF-ஐ பதிவிறக்கவும்', text: 'Click Generate & Download PDF to save your combined document.', textTa: 'PDF உருவாக்கு பட்டனை அழுத்தி உடனே ஆவணத்தை பதிவிறக்கவும்.' }
    ],
    relatedTools: ['jpg-to-pdf', 'png-to-pdf', 'photo-compress-100kb', 'photo-compress-50kb', 'passport-size-photo']
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
  },

  // 21. PDF MERGE TOOL (CLIENT-SIDE PDF-LIB)
  {
    id: 'pdf-merge',
    path: '/tools/pdf-merge',
    category: 'pdf',
    categoryTitle: 'PDF & Document Tools',
    categoryTitleTa: 'PDF & ஆவணக் கருவிகள்',
    title: 'PDF Merge Online – Combine Multiple PDF Files Free & Private | AK E-SEVAI Palani',
    titleTa: 'PDF மெர்ஜ் ஆன்லைன் – பல PDF கோப்புகளை ஒன்றாக இணைக்க | AK E-SEVAI பழனி',
    description: 'Merge multiple PDF files into one single PDF document online. 100% free, secure, and client-side processing in your browser. No server upload. Combine marksheets, certificates, and application forms.',
    descriptionTa: 'பல PDF கோப்புகளை ஒரே ஆவணமாக நொடியில் இணைத்துக் கொள்ளுங்கள். 100% இலவசம், முழுமையான பாதுகாப்பு. உங்கள் கோப்புகள் உங்கள் பிரவுசரிலேயே இணையும்; எந்த சர்வர்க்கும் பதிவேற்றப்படாது.',
    keywords: 'pdf merge, merge pdf online, combine pdf files, pdf joiner, pdf merge tamil, pdf merge online free, akesevai pdf merge',
    mode: 'pdf-merge',
    icon: 'Combine',
    badge: '100% Client-Side Private',
    badgeTa: '100% பிரைவேட் பிரவுசர் மெர்ஜ்',
    shortDesc: 'Merge multiple PDF documents, marksheets, and certificates into a single consolidated file directly in your browser.',
    shortDescTa: 'பல PDF ஆவணங்கள் மற்றும் சான்றிதழ்களை ஒரே கோப்பாக பிரவுசரிலேயே இணைத்து பதிவிறக்குங்கள்.',
    faqs: [
      {
        q: 'Are my private PDF documents uploaded to your server when merging?',
        qTa: 'PDF-களை இணைக்கும் போது எனது ஆவணங்கள் சர்வரில் சேமிக்கப்படுமா?',
        a: 'No! All merging is executed 100% locally inside your web browser using WebAssembly/JavaScript (pdf-lib). Your sensitive documents never leave your mobile or computer.',
        aTa: 'இல்லை! அனைத்து இணைப்புகளும் உங்கள் பிரவுசரிலேயே pdf-lib தொழில்நுட்பம் மூலம் பாதுகாப்பாக நடைபெறுகிறது. உங்கள் ஆவணங்கள் உங்கள் சாதனத்தை விட்டு வெளியேறாது.'
      },
      {
        q: 'How many PDF files can I merge together?',
        qTa: 'ஒரே நேரத்தில் எத்தனை PDF கோப்புகளை இணைக்கலாம்?',
        a: 'You can combine 2 to 20+ PDF documents simultaneously, arrange their order, and download the unified PDF in seconds.',
        aTa: '2 முதல் 20-க்கும் மேற்பட்ட PDF கோப்புகளை ஒரே நேரத்தில் வரிசைப்படுத்தி இணைத்து பதிவிறக்கலாம்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Select Multiple PDF Files', titleTa: 'PDF கோப்புகளைத் தேர்ந்தெடுக்கவும்', text: 'Click Upload or drag and drop 2 or more PDF documents.', textTa: 'ஒன்றிற்கு மேற்பட்ட PDF கோப்புகளை தேர்வு செய்யவும்.' },
      { step: 2, title: 'Review & Merge', titleTa: 'சரிபார்த்து இணைக்கவும்', text: 'Confirm the file order and click "Merge All PDFs".', textTa: 'வரிசையை சரிபார்த்து "PDF-களை இணை" பொத்தானை அழுத்தவும்.' },
      { step: 3, title: 'Download Merged PDF', titleTa: 'ஒருங்கிணைந்த PDF-ஐ பதிவிறக்கவும்', text: 'Instantly download your single combined PDF file.', textTa: 'இணைக்கப்பட்ட புதிய PDF கோப்பை உடனே சேமிக்கவும்.' }
    ],
    relatedTools: ['jpg-to-pdf', 'pdf-compress', 'image-to-pdf', 'dimension-checker']
  },

  // 22. PHOTO DIMENSION & FILE SIZE CHECKER
  {
    id: 'dimension-checker',
    path: '/tools/dimension-checker',
    category: 'crop-resize',
    categoryTitle: 'Crop & Resize Tools',
    categoryTitleTa: 'க்ராப் & ரீசைஸ் கருவிகள்',
    title: 'Photo Dimension & File Size Checker Online | AK E-SEVAI',
    titleTa: 'போட்டோ அளவு & KB சரிபார்ப்புக் கருவி | AK E-SEVAI',
    description: 'Instantly inspect image width, height, format, aspect ratio, and file size in KB locally in your browser. Compare against configurable exam reference targets; always verify the official notification before uploading.',
    descriptionTa: 'உங்கள் புகைப்படம் மற்றும் கையொப்பத்தின் நீளம், அகலம், வடிவம் மற்றும் KB அளவை உங்கள் பிரவுசரிலேயே சரிபாருங்கள். பதிவேற்றும் முன் சமீபத்திய தேர்வு அறிவிப்பை சரிபார்க்கவும்.',
    keywords: 'photo dimension checker, check image size in kb, photo size checker online, tnpsc photo size check, image pixel checker, check signature size',
    mode: 'dimension-checker',
    icon: 'FileCheck2',
    badge: 'Dimension & KB Check',
    badgeTa: 'அளவு & KB சரிபார்ப்பு',
    shortDesc: 'Inspect image pixel dimensions, format, aspect ratio, and file size (KB) against configurable reference ranges.',
    shortDescTa: 'படத்தின் நீள, அகல பிக்சல்கள், வடிவம் மற்றும் KB அளவை பிரவுசரிலேயே சரிபாருங்கள்.',
    faqs: [
      {
        q: 'Why do government portals reject photos during online application?',
        qTa: 'அரசு இணையதளங்கள் புகைப்படங்களை ஏன் நிராகரிக்கின்றன?',
        a: 'Common rejections occur when file size (KB), pixel dimensions, or aspect ratio fall outside a portal’s listed range. Check width, height, format, and file size here, and confirm visual criteria (like background color or name/date strips) manually against the latest official notification.',
        aTa: 'அனுமதிக்கப்பட்ட KB அளவு, பிக்சல் பரிமாணம் அல்லது விகிதம் இணையதள விதிகளோடு பொருந்தாதபோது நிராகரிக்கப்படலாம். இங்கு அளவுகளைச் சரிபார்த்து, சமீபத்திய அதிகாரப்பூர்வ அறிவிப்பையும் உறுதிப்படுத்தவும்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Image or Signature', titleTa: 'படத்தை பதிவேற்றவும்', text: 'Select your photo or signature file.', textTa: 'உங்கள் போட்டோ அல்லது கையொப்ப கோப்பை தேர்வு செய்யவும்.' },
      { step: 2, title: 'Instant Metric Analysis', titleTa: 'அளவீடுகளை அறியவும்', text: 'View exact Width, Height, Format, Aspect Ratio, and File Size (KB).', textTa: 'துல்லியமான பிக்சல் அளவு மற்றும் KB அளவை திரையில் பார்க்கவும்.' },
      { step: 3, title: 'Adjust if Needed', titleTa: 'தேவைப்பட்டால் மாற்றவும்', text: 'Use our resize or compression tools if you need different dimensions or smaller KB.', textTa: 'தேவைப்பட்டால் ரீசைஸ் அல்லது கம்ப்ரஸ் கருவிகள் மூலம் அளவை மாற்றவும்.' }
    ],
    relatedTools: ['document-size-checker', 'passport-size-photo', 'signature-resize', 'photo-compress-50kb']
  },

  // 23. GOVERNMENT EXAM PHOTO PREPARATION TOOL
  {
    id: 'govt-exam-photo-tool',
    path: '/tools/govt-exam-photo-tool',
    category: 'passport',
    categoryTitle: 'Passport & Identity Photos',
    categoryTitleTa: 'பாஸ்போர்ட் & அடையாளப் படங்கள்',
    title: 'Government Exam Photo & Signature Resizer Online | AK E-SEVAI',
    titleTa: 'அரசுத் தேர்வு போட்டோ & கையொப்ப ரீசைஸ் கருவி | AK E-SEVAI',
    description: 'Configure pixel dimensions and target KB size for competitive exam photos and signatures locally in your browser. Includes reference presets for TNPSC, SSC, UPSC, Bank, and Police; verify latest official notification rules.',
    descriptionTa: 'அரசுப் போட்டித் தேர்வுகளுக்கான புகைப்பட மற்றும் கையொப்ப அளவுகளை பிரவுசரிலேயே தயாரிக்கும் கருவி. TNPSC, SSC, UPSC, வங்கி மற்றும் காவலர் தேர்வு மாதிரி அளவுகள் உள்ளன; விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ அறிவிப்பை சரிபார்க்கவும்.',
    keywords: 'govt exam photo maker, tnpsc photo generator with name date, ssc photo resize, upsc photo tool, exam signature maker, போட்டித் தேர்வு போட்டோ மேக்கர்',
    mode: 'exam-resizer',
    icon: 'Camera',
    badge: 'Configurable Exam Presets',
    badgeTa: 'தேர்வு மாதிரி அளவுகள்',
    shortDesc: 'Resize and compress photos/signatures with configurable reference presets for TNPSC, SSC, UPSC, Bank & Police portals.',
    shortDescTa: 'TNPSC, SSC, UPSC, வங்கி மற்றும் காவலர் தேர்வு மாதிரி அளவுகளுக்கு ஏற்ப படங்களை மாற்ற உதவும் கருவி.',
    defaultTargetKb: 50,
    presetSizes: [
      { label: 'TNPSC Photo Reference (350 × 450 px, ≤50 KB, Optional Stamp)', w: 350, h: 450, targetKb: 50, hasNameStamp: true, name: 'TNPSC Photo Ref' },
      { label: 'TNPSC / Govt Signature Reference (200 × 100 px, ≤20 KB)', w: 200, h: 100, targetKb: 20, hasNameStamp: false, name: 'Signature Ref' },
      { label: 'SSC Photo Reference (200 × 230 px, ≤35 KB)', w: 200, h: 230, targetKb: 35, hasNameStamp: false, name: 'SSC Photo Ref' },
      { label: 'UPSC Square Reference (350 × 350 px, ≤75 KB)', w: 350, h: 350, targetKb: 75, hasNameStamp: false, name: 'UPSC Square Ref' },
      { label: 'Bank / TNUSRB Reference (350 × 450 px, ≤45 KB)', w: 350, h: 450, targetKb: 45, hasNameStamp: false, name: 'Bank/Police Ref' }
    ],
    faqs: [
      {
        q: 'How to add an optional Name and Date strip on a TNPSC application photo?',
        qTa: 'புகைப்படத்தில் விருப்பத்திற்கேற்ப பெயர் மற்றும் தேதியை சேர்ப்பது எப்படி?',
        a: 'If the current official exam notification requires a Name and Photo Date on the photograph, check the "Add Name & Date Stamp" option and enter the details. Always verify exact dimensions and stamp rules in the official exam notification before uploading.',
        aTa: 'தற்போதைய தேர்வு அறிவிப்பில் பெயர் மற்றும் தேதி கட்டாயம் எனக் குறிப்பிட்டிருந்தால் மட்டும் அந்த விருப்பத்தைத் தேர்ந்தெடுத்து விவரங்களை உள்ளிடவும். பதிவேற்றும் முன் சமீபத்திய அறிவிப்பை கட்டாயம் சரிபார்க்கவும்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Pick Reference Preset or Custom Size', titleTa: 'அளவைத் தேர்ந்தெடுக்கவும்', text: 'Pick an exam preset or enter the exact pixels and KB required by your notification.', textTa: 'தேர்வு மாதிரி அளவு அல்லது அறிவிப்பில் உள்ள பிக்சல்/KB அளவை அமைக்கவும்.' },
      { step: 2, title: 'Upload & Optional Stamp', titleTa: 'படம் & விருப்ப விவரங்கள்', text: 'Upload your photo, add optional name/date strip if needed.', textTa: 'படத்தை பதிவேற்றி, தேவைப்பட்டால் பெயர்/தேதி சேர்க்கவும்.' },
      { step: 3, title: 'Verify Output & Download', titleTa: 'சரிபார்த்து பதிவிறக்கவும்', text: 'Confirm output pixels and KB size meet your official notification, then download JPG.', textTa: 'அவுட்புட் பிக்சல் மற்றும் KB அளவை சரிபார்த்து JPG-ஐ பதிவிறக்கவும்.' }
    ],
    relatedTools: ['tnpsc-photo-resizer', 'ssc-photo-resizer', 'rrb-photo-resizer', 'signature-resize', 'dimension-checker']
  },

  // 24. PDF SPLIT TOOL
  {
    id: 'pdf-split',
    path: '/tools/pdf-split',
    category: 'pdf',
    categoryTitle: 'PDF & Document Tools',
    categoryTitleTa: 'PDF & ஆவணக் கருவிகள்',
    title: 'Split PDF Online Free – Separate PDF Pages Locally | AK E-SEVAI',
    titleTa: 'PDF பக்கங்களை பிரிக்க (Split PDF) – ஆன்லைன் இலவசக் கருவி | AK E-SEVAI',
    description: 'Split a multi-page PDF into individual pages or custom page groups (e.g. 1-2; 3-4) 100% locally in your browser using pdf-lib. Zero server uploads.',
    descriptionTa: 'பல பக்கங்கள் கொண்ட PDF ஆவணத்தை தனித்தனி பக்கங்களாகவோ அல்லது குறிப்பிட்ட குழுக்களாகவோ உங்கள் பிரவுசரிலேயே பிரிக்கலாம். கோப்புகள் சர்வருக்கு அனுப்பப்படாது.',
    keywords: 'split pdf online, pdf split, separate pdf pages, pdf splitter free, PDF பக்கங்களை பிரிக்க',
    mode: 'pdf-split',
    icon: 'Layers',
    badge: '100% Client-Side Split',
    badgeTa: 'பிரவுசர் PDF பிரிப்பு',
    shortDesc: 'Split multi-page PDF files into separate single-page PDFs or custom page-range parts in browser memory.',
    shortDescTa: 'பல பக்க PDF கோப்புகளை தனித்தனி பக்கங்களாகவோ பிரிவுகளாகவோ பிரிக்க உதவும் இலவசக் கருவி.',
    faqs: [
      {
        q: 'Can I split specific page groups from a PDF?',
        qTa: 'குறிப்பிட்ட பக்க எண்களைத் தொகுப்பாக பிரிக்க முடியுமா?',
        a: 'Yes! Choose "Split every page" or choose "Custom range groups" and enter ranges separated by semicolons like "1-2; 3-5".',
        aTa: 'ஆம்! அனைத்துப் பக்கங்களையும் தனித்தனியாகவோ அல்லது "1-2; 3-5" என குழுக்களாகவோ பிரிக்கலாம்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Select PDF File', titleTa: 'PDF கோப்பை தேர்ந்தெடுக்கவும்', text: 'Upload an unencrypted PDF file (up to 40 MB).', textTa: '40 MB வரை உள்ள PDF கோப்பை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Choose Split Mode', titleTa: 'பிரிக்கும் முறையை அமைக்கவும்', text: 'Split every page individually or enter custom ranges like 1-2; 3-4.', textTa: 'ஒவ்வொரு பக்கத்தையும் தனியாகவோ வரம்பாகவோ தேர்ந்தெடுக்கவும்.' },
      { step: 3, title: 'Download Split PDFs', titleTa: 'பிரித்த PDF-களை சேமிக்கவும்', text: 'Download each generated PDF segment immediately.', textTa: 'உருவாக்கப்பட்ட PDF கோப்புகளை உடனே பதிவிறக்கவும்.' }
    ],
    relatedTools: ['pdf-extract', 'pdf-merge', 'pdf-rotate', 'pdf-compress']
  },

  // 25. PDF ROTATE PAGES
  {
    id: 'pdf-rotate',
    path: '/tools/pdf-rotate',
    category: 'pdf',
    categoryTitle: 'PDF & Document Tools',
    categoryTitleTa: 'PDF & ஆவணக் கருவிகள்',
    title: 'Rotate PDF Pages Online Free – Fix Sideways PDFs | AK E-SEVAI',
    titleTa: 'PDF பக்கங்களை சுழற்ற (Rotate PDF) – ஆன்லைன் கருவி | AK E-SEVAI',
    description: 'Rotate sideways or upside-down PDF pages permanently (90°, 180°, 270°) locally in your browser with pdf-lib. Rotate all pages or selected page numbers without server upload.',
    descriptionTa: 'சாய்வாக அல்லது தலைகீழாக உள்ள PDF பக்கங்களை 90°, 180°, 270° கோணத்தில் நிரந்தரமாக சுழற்றி சரிசெய்யுங்கள். 100% பிரவுசரிலேயே பாதுகாப்பாக நடைபெறும்.',
    keywords: 'rotate pdf, pdf rotate pages, rotate pdf online free, turn pdf page 90 degrees',
    mode: 'pdf-rotate',
    icon: 'RotateCw',
    badge: 'Permanent Page Rotation',
    badgeTa: 'நிரந்தர PDF சுழற்சி',
    shortDesc: 'Fix sideways scanned documents by rotating all or specific PDF pages 90°, 180°, or 270° directly in your browser.',
    shortDescTa: 'சாய்வாக ஸ்கேன் செய்யப்பட்ட PDF பக்கங்களை 90°, 180°, 270° சுழற்றி நேராக்குங்கள்.',
    faqs: [
      {
        q: 'Can I rotate only specific pages instead of the entire PDF?',
        qTa: 'முழு PDF-ஐயும் சுழற்றாமல் குறிப்பிட்ட பக்கத்தை மட்டும் சுழற்ற முடியுமா?',
        a: 'Yes! Leave page range blank to rotate all pages, or specify pages like "2, 4-5" to rotate only those pages.',
        aTa: 'ஆம்! அனைத்து பக்கங்களுக்கும் காலியாக விடவும், அல்லது "2, 4-5" என பக்க எண்களைக் குறிப்பிட்டு சுழற்றலாம்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Select PDF File', titleTa: 'PDF கோப்பை பதிவேற்றவும்', text: 'Select the scanned PDF document from your device.', textTa: 'சாய்வாக உள்ள PDF கோப்பை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Pick Angle & Pages', titleTa: 'கோணம் & பக்கங்களை தேர்ந்தெடுக்கவும்', text: 'Pick 90° clockwise, 180°, or 270° (counter-clockwise).', textTa: '90°, 180° அல்லது 270° சுழற்சி கோணத்தைத் தேர்ந்தெடுக்கவும்.' },
      { step: 3, title: 'Download Corrected PDF', titleTa: 'சரியான PDF-ஐ பதிவிறக்கவும்', text: 'Download the permanently rotated PDF file.', textTa: 'நேராக்கப்பட்ட PDF கோப்பை உடனே சேமிக்கவும்.' }
    ],
    relatedTools: ['pdf-merge', 'pdf-split', 'pdf-extract', 'pdf-compress']
  },

  // 26. PDF PAGE EXTRACTOR
  {
    id: 'pdf-extract',
    path: '/tools/pdf-extract',
    category: 'pdf',
    categoryTitle: 'PDF & Document Tools',
    categoryTitleTa: 'PDF & ஆவணக் கருவிகள்',
    title: 'Extract PDF Pages Online Free – Save Selected Pages | AK E-SEVAI',
    titleTa: 'தேவையான PDF பக்கங்களை மட்டும் பிரித்தெடுக்க (Extract PDF) | AK E-SEVAI',
    description: 'Extract exact pages (e.g. 1, 3, 5-8) from a large PDF into one clean new PDF locally in your browser using pdf-lib. Private, fast & zero server uploads.',
    descriptionTa: 'பெரிய PDF ஆவணத்திலிருந்து உங்களுக்கு தேவையான குறிப்பிட்ட பக்கங்களை (எ.கா: 1, 3, 5-8) மட்டும் தனியாக எடுத்து புதிய PDF-ஆக சேமியுங்கள்.',
    keywords: 'pdf page extractor, extract pages from pdf, extract pdf pages online free, remove unwanted pdf pages',
    mode: 'pdf-extract',
    icon: 'FileText',
    badge: 'Select & Extract Pages',
    badgeTa: 'குறிப்பிட்ட பக்க பிரிப்பு',
    shortDesc: 'Extract chosen page numbers or ranges from a multi-page PDF into a new single clean PDF document.',
    shortDescTa: 'பல பக்க PDF-ல் இருந்து குறிப்பிட்ட பக்கங்களை மட்டும் தேர்ந்தெடுத்து புதிய PDF உருவாக்குங்கள்.',
    faqs: [
      {
        q: 'How do I format page ranges for extraction?',
        qTa: 'பக்க எண்களை எவ்வாறு உள்ளிட வேண்டும்?',
        a: 'Type comma-separated numbers and ranges such as "1, 4, 6-9". Pages are extracted in the exact order entered.',
        aTa: '"1, 4, 6-9" போன்ற வடிவத்தில் கமா மற்றும் ஹைபன் பயன்படுத்தி தேவையான பக்கங்களைப் பிரிக்கலாம்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Multi-Page PDF', titleTa: 'PDF கோப்பை பதிவேற்றவும்', text: 'Select the PDF file containing extra pages.', textTa: 'பக்கங்களை எடுக்க வேண்டிய PDF கோப்பை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Enter Page Numbers', titleTa: 'பக்க எண்களை உள்ளிடவும்', text: 'Specify exact pages to keep, such as "1, 3-5".', textTa: '"1, 3-5" என தேவைப்படும் பக்க எண்களை உள்ளிடவும்.' },
      { step: 3, title: 'Download Extracted PDF', titleTa: 'புதிய PDF-ஐ பதிவிறக்கவும்', text: 'Download a single PDF containing only your chosen pages.', textTa: 'தேர்ந்தெடுக்கப்பட்ட பக்கங்கள் மட்டும் கொண்ட PDF-ஐ சேமிக்கவும்.' }
    ],
    relatedTools: ['pdf-split', 'pdf-merge', 'pdf-rotate', 'pdf-compress']
  },

  // 27. COMPRESS PHOTO TO 200KB
  {
    id: 'photo-compress-200kb',
    path: '/tools/photo-compress-200kb',
    category: 'compression',
    categoryTitle: 'Compression Tools',
    categoryTitleTa: 'கம்ப்ரஷன் கருவிகள்',
    title: 'Compress Image & Photo to 200 KB Online Free | AK E-SEVAI',
    titleTa: 'போட்டோவை 200 KB-க்குள் சுருக்க – ஆன்லைன் கருவி | AK E-SEVAI',
    description: 'Compress scanned certificates, marksheets, and photos cleanly under 200 KB locally in your browser without sacrificing text readability for portal uploads across Tamil Nadu.',
    descriptionTa: 'மார்க்ஷீட், சான்றிதழ் படங்கள் மற்றும் புகைப்படங்களை எழுத்துத் தெளிவு குறையாமல் 200 KB-க்குள் உங்கள் பிரவுசரிலேயே சுருக்குங்கள்.',
    keywords: 'compress photo to 200kb, compress image to 200kb, reduce image under 200kb, 200kb image compressor',
    mode: 'compress-target',
    icon: 'Minimize2',
    badge: 'Target: ≤ 200 KB',
    badgeTa: 'இலக்கு: ≤ 200 KB',
    shortDesc: 'Compress high-resolution documents and scanned marksheets cleanly under 200 KB for portal uploads.',
    shortDescTa: 'ஸ்கேன் செய்யப்பட்ட சான்றிதழ் மற்றும் ஆவணப் படங்களை 200 KB-க்குள் தெளிவாக சுருக்க உதவும் கருவி.',
    defaultTargetKb: 200,
    faqs: [
      {
        q: 'When is a 200 KB image file limit required?',
        qTa: '200 KB புகைப்பட வரம்பு எங்கு பயன்படுத்தப்படுகிறது?',
        a: 'Many Tamil Nadu e-Sevai, scholarship, and college admission portals limit scanned marksheet or document image uploads to 200 KB. Check your portal upload instructions carefully.',
        aTa: 'பல கல்வி உதவித்தொகை, கல்லூரி சேர்க்கை மற்றும் ஆன்லைன் போர்ட்டல்கள் ஆவணப் படங்களுக்கு 200 KB வரம்பை நிர்ணயிக்கின்றன.'
      }
    ],
    howTo: [
      { step: 1, title: 'Upload Document Photo', titleTa: 'ஆவணப் படத்தை பதிவேற்றவும்', text: 'Select the scanned marksheet, certificate, or photo.', textTa: 'பெரிய அளவிலான மார்க்ஷீட் அல்லது சான்றிதழ் படத்தைத் தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Compress to ≤200 KB', titleTa: '200 KB-க்கு சுருக்கவும்', text: 'Engine preserves legibility while bringing file size under 200 KB.', textTa: 'எழுத்துத் தெளிவுடன் 200 KB-க்குள் தானாகச் சுருக்கப்படும்.' },
      { step: 3, title: 'Download JPG', titleTa: 'JPG-ஐ பதிவிறக்கவும்', text: 'Save the compact JPG ready for form upload.', textTa: 'பதிவேற்ற தயாரான JPG கோப்பை சேமிக்கவும்.' }
    ],
    relatedTools: ['photo-compress-100kb', 'photo-compress-50kb', 'photo-compress', 'document-size-checker']
  },

  // 28. DOCUMENT SIZE CHECKER (PDF + IMAGE)
  {
    id: 'document-size-checker',
    path: '/tools/document-size-checker',
    category: 'crop-resize',
    categoryTitle: 'Crop & Resize Tools',
    categoryTitleTa: 'க்ராப் & ரீசைஸ் கருவிகள்',
    title: 'Document Size Checker Online (PDF Page Count & Image KB) | AK E-SEVAI',
    titleTa: 'ஆவண அளவு சரிபார்ப்புக் கருவி (PDF & Image KB Checker) | AK E-SEVAI',
    description: 'Check file size in KB/MB, MIME format, PDF page count & paper size (A4/Legal), or image pixel dimensions 100% locally in your browser before uploading to online portals.',
    descriptionTa: 'அரசு அல்லது தேர்வு இணையதளங்களில் பதிவேற்றும் முன் PDF பக்க எண்ணிக்கை, தாள் அளவு (A4/Legal), படப் பிக்சல் மற்றும் KB/MB அளவை உடனடியாக பிரவுசரிலேயே சரிபாருங்கள்.',
    keywords: 'document size checker, check pdf file size and pages, check document kb online, verify pdf dimensions',
    mode: 'document-checker',
    icon: 'FileCheck2',
    badge: 'PDF & Image Inspector',
    badgeTa: 'PDF & பட சரிபார்ப்பு',
    shortDesc: 'Inspect PDF page count, page size (A4/Letter), encryption status, and image pixel/KB metrics locally.',
    shortDescTa: 'PDF பக்க எண்ணிக்கை, A4 அளவு மற்றும் படங்களின் KB/பிக்சல் அளவை உடனே அறிய உதவும் கருவி.',
    faqs: [
      {
        q: 'What does Document Size Checker inspect for PDF vs Images?',
        qTa: 'இந்தக் கருவி PDF மற்றும் படங்களில் எதைச் சரிபார்க்கிறது?',
        a: 'For PDFs, it checks exact byte/KB size, page count, each page’s physical dimensions (e.g., A4/Legal), and whether it is encrypted. For images, it reports format, width x height pixels, aspect ratio, and exact KB size.',
        aTa: 'PDF கோப்புகளில் KB அளவு, பக்கங்களின் எண்ணிக்கை, தாள் அளவு (A4/Legal) ஆகியவற்றையும், படங்களில் பிக்சல் அளவு மற்றும் KB அளவையும் சரிபார்க்கிறது.'
      }
    ],
    howTo: [
      { step: 1, title: 'Select PDF or Image', titleTa: 'PDF அல்லது படத்தை தேர்ந்தெடுக்கவும்', text: 'Upload any PDF document or JPG/PNG/WEBP image.', textTa: 'PDF ஆவணம் அல்லது படத்தை தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Inspect Verified Metrics', titleTa: 'துல்லிய விவரங்களைப் பார்க்கவும்', text: 'Read exact KB size, format, page dimensions, and page count.', textTa: 'KB அளவு, வடிவம் மற்றும் பக்க விவரங்களைப் பார்க்கவும்.' },
      { step: 3, title: 'Fix Size if Needed', titleTa: 'தேவைப்பட்டால் சுருக்கவும்', text: 'Jump straight to PDF Compressor or Photo Compressor if too large.', textTa: 'அளவு அதிகமாக இருந்தால் கம்ப்ரஸர் கருவிக்கு நேரடியாக செல்லவும்.' }
    ],
    relatedTools: ['dimension-checker', 'pdf-compress', 'photo-compress-100kb', 'photo-compress-200kb']
  },

  // 29. TNPSC PHOTO & SIGNATURE RESIZER
  {
    id: 'tnpsc-photo-resizer',
    path: '/tools/tnpsc-photo-resizer',
    category: 'passport',
    categoryTitle: 'Passport & Identity Photos',
    categoryTitleTa: 'பாஸ்போர்ட் & அடையாளப் படங்கள்',
    title: 'TNPSC Photo & Signature Resizer Online (Name & Date Option) | AK E-SEVAI',
    titleTa: 'TNPSC போட்டோ & கையொப்ப ரீசைஸ் கருவி (பெயர் & தேதி) | AK E-SEVAI',
    description: 'Prepare photos and signatures for TNPSC Group 1, 2, 4, and VAO applications locally in your browser with configurable dimensions, KB compression, and optional Name & Date strip. Check official TNPSC OTR guidelines before uploading.',
    descriptionTa: 'TNPSC தேர்வு விண்ணப்பங்களுக்கு உதவும் வகையில் புகைப்படம் & கையொப்பத்தை உங்கள் பிரவுசரிலேயே சரிசெய்யும் கருவி. பதிவேற்றும் முன் அதிகாரப்பூர்வ TNPSC அறிவிப்பு விதிகளை சரிபார்க்கவும்.',
    keywords: 'tnpsc photo resizer, tnpsc photo resize online, tnpsc photo compressor, tnpsc photo with name and date, tnpsc signature resize 20kb',
    mode: 'exam-resizer',
    icon: 'Camera',
    badge: 'TNPSC Reference Presets',
    badgeTa: 'TNPSC மாதிரி கருவி',
    shortDesc: 'Configurable browser resizer with TNPSC photo/signature reference presets and optional Name/Date strip.',
    shortDescTa: 'TNPSC தேர்வுகளுக்கான மாதிரி அளவுகள் மற்றும் விருப்பப் பெயர்/தேதி முத்திரை வசதி கொண்ட கருவி.',
    defaultTargetKb: 50,
    presetSizes: [
      { label: 'TNPSC Photo Ref (350 × 450 px, ≤50 KB, Name/Date Option)', w: 350, h: 450, targetKb: 50, hasNameStamp: true, name: 'TNPSC Photo' },
      { label: 'TNPSC Signature Ref (200 × 100 px, ≤20 KB)', w: 200, h: 100, targetKb: 20, hasNameStamp: false, name: 'TNPSC Signature' }
    ],
    faqs: [
      {
        q: 'Do TNPSC photo and signature specifications vary between notifications?',
        qTa: 'TNPSC தேர்வு அறிவிப்புகளுக்கு இடையே போட்டோ விதிகள் மாறுபடுமா?',
        a: 'Yes, official commissions occasionally update pixel, KB, background, or name-date requirements across exam notifications. Always verify the active TNPSC official brochure before uploading.',
        aTa: 'ஆம், ஒவ்வொரு தேர்வு அறிவிப்பிலும் விதிகளில் சிறிய மாற்றங்கள் இருக்கலாம். எனவே பதிவேற்றும் முன் சமீபத்திய TNPSC அதிகாரப்பூர்வ அறிவிப்பைக் கட்டாயம் சரிபார்க்கவும்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Select Photo or Signature Preset', titleTa: 'போட்டோ / கையொப்பம் தேர்வு செய்யவும்', text: 'Pick the Photo preset or Signature preset (or customize width/height/KB).', textTa: 'போட்டோ அல்லது கையொப்ப அளவைத் தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Optional Name & Date Strip', titleTa: 'பெயர் & தேதி (தேவையெனில்)', text: 'Enable Name & Date strip if specified in your notification.', textTa: 'அறிவிப்பில் தேவைப்பட்டால் பெயர் மற்றும் தேதி சேர்க்கவும்.' },
      { step: 3, title: 'Verify & Download JPG', titleTa: 'சரிபார்த்து பதிவிறக்கவும்', text: 'Check result KB and pixels, then download locally.', textTa: 'KB அளவை உறுதிசெய்து பதிவிறக்கவும்.' }
    ],
    relatedTools: ['govt-exam-photo-tool', 'signature-resize', 'ssc-photo-resizer', 'dimension-checker']
  },

  // 30. SSC PHOTO & SIGNATURE RESIZER
  {
    id: 'ssc-photo-resizer',
    path: '/tools/ssc-photo-resizer',
    category: 'passport',
    categoryTitle: 'Passport & Identity Photos',
    categoryTitleTa: 'பாஸ்போர்ட் & அடையாளப் படங்கள்',
    title: 'SSC Photo & Signature Resizer Online (CGL, CHSL, MTS, GD) | AK E-SEVAI',
    titleTa: 'SSC தேர்வு போட்டோ & கையொப்ப ரீசைஸ் கருவி | AK E-SEVAI',
    description: 'Resize and compress photos and signatures for SSC OTR, CGL, CHSL, MTS, and Constable GD portal requirements locally in your browser. Verify exact dimensions against the latest SSC notice.',
    descriptionTa: 'SSC CGL, CHSL, MTS தேர்வுகளுக்கான மாதிரி அளவுகளில் போட்டோ & கையொப்பத்தை உங்கள் பிரவுசரிலேயே சரிசெய்யுங்கள். பதிவேற்றும் முன் அதிகாரப்பூர்வ SSC அறிவிப்பை சரிபார்க்கவும்.',
    keywords: 'ssc photo resizer, ssc photo resize online, ssc photo compressor, ssc signature size converter',
    mode: 'exam-resizer',
    icon: 'Camera',
    badge: 'SSC Reference Presets',
    badgeTa: 'SSC மாதிரி கருவி',
    shortDesc: 'Configurable browser resizer with SSC CGL/CHSL/MTS photo & signature reference presets.',
    shortDescTa: 'SSC தேர்வுகளுக்கான மாதிரி போட்டோ & கையொப்ப அளவுக் கருவி.',
    defaultTargetKb: 35,
    presetSizes: [
      { label: 'SSC Photo Ref (200 × 230 px, ≤35 KB)', w: 200, h: 230, targetKb: 35, hasNameStamp: false, name: 'SSC Photo' },
      { label: 'SSC Passport Ratio Ref (350 × 450 px, ≤50 KB)', w: 350, h: 450, targetKb: 50, hasNameStamp: false, name: 'SSC 3.5x4.5' },
      { label: 'SSC Signature Ref (140 × 60 px, ≤20 KB)', w: 140, h: 60, targetKb: 20, hasNameStamp: false, name: 'SSC Signature' }
    ],
    faqs: [
      {
        q: 'Does SSC now require live webcam capture during OTR?',
        qTa: 'SSC OTR-ல் நேரடி கேமரா புகைப்படம் உள்ளதா?',
        a: 'Recent SSC notifications introduced live photo capture in addition to/instead of file upload for certain portals, while signature upload remains active. Always check the official SSC notice for current rules.',
        aTa: 'சமீபத்திய SSC விண்ணப்பங்களில் நேரடி வெப்கேம் புகைப்பட முறை அறிமுகப்படுத்தப்பட்டுள்ளது; கையொப்பம் மற்றும் சில பிரிவுகளுக்கு கோப்பு பதிவேற்றம் தொடர்கிறது.'
      }
    ],
    howTo: [
      { step: 1, title: 'Select SSC Reference Size', titleTa: 'SSC அளவைத் தேர்ந்தெடுக்கவும்', text: 'Pick SSC Photo or Signature reference or customize target KB.', textTa: 'SSC போட்டோ அல்லது கையொப்ப மாதிரி அளவைத் தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Process in Browser', titleTa: 'பிரவுசரில் மாற்றவும்', text: 'Image is cropped/resized cleanly on HTML5 Canvas.', textTa: 'உங்கள் சாதனத்திலேயே அளவு மாற்றப்படும்.' },
      { step: 3, title: 'Check Notification & Save', titleTa: 'சரிபார்த்து சேமிக்கவும்', text: 'Verify output KB and download JPG.', textTa: 'அவுட்புட் KB-ஐ சரிபார்த்து சேமிக்கவும்.' }
    ],
    relatedTools: ['tnpsc-photo-resizer', 'rrb-photo-resizer', 'signature-resize', 'dimension-checker']
  },

  // 31. RRB EXAM PHOTO & SIGNATURE RESIZER
  {
    id: 'rrb-photo-resizer',
    path: '/tools/rrb-photo-resizer',
    category: 'passport',
    categoryTitle: 'Passport & Identity Photos',
    categoryTitleTa: 'பாஸ்போர்ட் & அடையாளப் படங்கள்',
    title: 'RRB Exam Photo & Signature Resizer (NTPC, ALP, Group D) | AK E-SEVAI',
    titleTa: 'ரயில்வே (RRB) தேர்வு போட்டோ & கையொப்ப ரீசைஸ் கருவி | AK E-SEVAI',
    description: 'Resize and compress photos & signatures locally for Railway Recruitment Board (RRB NTPC, ALP, Technician, Group D) applications across Tamil Nadu. Verify exact notification limits before upload.',
    descriptionTa: 'ரயில்வே RRB (NTPC, ALP, Group D) தேர்வுகளுக்கான மாதிரி அளவுகளில் போட்டோ மற்றும் கையொப்பத்தை உங்கள் பிரவுசரிலேயே தயாரித்திடுங்கள். சமீபத்திய RRB அறிவிப்பை சரிபார்க்கவும்.',
    keywords: 'rrb photo resizer, rrb exam photo size converter, railway exam photo resize, rrb signature size reducer',
    mode: 'exam-resizer',
    icon: 'Camera',
    badge: 'RRB Reference Presets',
    badgeTa: 'ரயில்வே மாதிரி கருவி',
    shortDesc: 'Configurable resizer and compressor with RRB NTPC/ALP/Group D photo & signature reference presets.',
    shortDescTa: 'ரயில்வே RRB தேர்வுகளுக்கான மாதிரி போட்டோ மற்றும் கையொப்ப அளவீட்டுக் கருவி.',
    defaultTargetKb: 50,
    presetSizes: [
      { label: 'RRB Photo Ref (350 × 450 px / 35×45 mm, ≤50 KB)', w: 350, h: 450, targetKb: 50, hasNameStamp: false, name: 'RRB Photo' },
      { label: 'RRB Larger KB Ref (350 × 450 px, ≤70 KB)', w: 350, h: 450, targetKb: 70, hasNameStamp: false, name: 'RRB 70KB' },
      { label: 'RRB Signature Ref (140 × 60 px, ≤30 KB)', w: 140, h: 60, targetKb: 30, hasNameStamp: false, name: 'RRB Signature' }
    ],
    faqs: [
      {
        q: 'What background color is commonly mentioned in RRB notifications?',
        qTa: 'ரயில்வே தேர்வுப் புகைப்படத்திற்கு என்ன பின்னணி நிறம் தேவை?',
        a: 'RRB notifications typically require a clear color photograph against a plain white background without dark glasses or caps. Verify the exact CEN notification rules before uploading.',
        aTa: 'பொதுவாக வெற்று வெள்ளை பின்னணியுடன் கூடிய தெளிவான புகைப்படம் கோரப்படுகிறது. பதிவேற்றும் முன் சமீபத்திய CEN அறிவிப்பைச் சரிபார்க்கவும்.'
      }
    ],
    howTo: [
      { step: 1, title: 'Pick RRB Preset', titleTa: 'RRB அளவைத் தேர்ந்தெடுக்கவும்', text: 'Select RRB Photo or Signature reference.', textTa: 'RRB போட்டோ அல்லது கையொப்ப மாதிரி அளவைத் தேர்ந்தெடுக்கவும்.' },
      { step: 2, title: 'Upload & Adjust', titleTa: 'படத்தை பதிவேற்றவும்', text: 'Upload from your mobile or computer cleanly.', textTa: 'மொபைல் அல்லது கணினியிலிருந்து பதிவேற்றவும்.' },
      { step: 3, title: 'Download Locally', titleTa: 'உடனே பதிவிறக்கவும்', text: 'Save the resized file locally without any server upload.', textTa: 'சர்வருக்கு அனுப்பாமல் உங்கள் சாதனத்தில் உடனே சேமிக்கவும்.' }
    ],
    relatedTools: ['govt-exam-photo-tool', 'tnpsc-photo-resizer', 'ssc-photo-resizer', 'signature-resize']
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

  // Quick canonical redirects map for slugs without duplicating blocks
  const EXTRA_ALIAS_PARENTS = {
    'image-resizer': 'photo-resizer',
    'signature-resizer': 'signature-resize'
  };

  if (EXTRA_ALIAS_PARENTS[clean]) {
    const parent = PHOTO_TOOLS_CATALOG.find(t => t.id === EXTRA_ALIAS_PARENTS[clean]);
    if (parent) {
      return {
        ...parent,
        canonical: `https://www.akesevai.com${parent.path}`
      };
    }
  }

  // 2. Search Intent Alias Match (points canonical cleanly to parent canonical tool)
  if (SEARCH_INTENT_TOOL_ALIASES[clean]) {
    const aliasInfo = SEARCH_INTENT_TOOL_ALIASES[clean];
    const parent = PHOTO_TOOLS_CATALOG.find(t => t.id === aliasInfo.parentId);
    if (parent) {
      return {
        ...parent,
        canonical: `https://www.akesevai.com${parent.path}`,
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
    title: 'Passport & Government Exam Photos',
    titleTa: 'பாஸ்போர்ட் & அரசுத் தேர்வு போட்டோ கருவிகள்',
    desc: 'Make 3.5x4.5 cm or 2x2 inch passport photos, configure TNPSC, SSC & RRB sizes, and generate 4x6 / A4 print sheets.',
    descTa: 'பாஸ்போர்ட் போட்டோக்கள், TNPSC, SSC, RRB மாதிரி அளவுகள் மற்றும் 4x6 / A4 அச்சிடும் தாள்களை தயார் செய்யுங்கள்.',
    toolIds: ['passport-size-photo', 'govt-exam-photo-tool', 'tnpsc-photo-resizer', 'ssc-photo-resizer', 'rrb-photo-resizer', 'passport-photo-resize']
  },
  {
    id: 'compression',
    title: 'Precision Photo Size Reducers',
    titleTa: 'புகைப்பட அளவு குறைப்பான் (KB)',
    desc: 'Compress images under 20 KB, 50 KB, 100 KB, or 200 KB locally in your browser with real size validation.',
    descTa: 'புகைப்படங்களை 20 KB, 50 KB, 100 KB அல்லது 200 KB அளவிற்கு பிரவுசரிலேயே சுருக்குங்கள்.',
    toolIds: ['photo-compress', 'photo-compress-20kb', 'photo-compress-50kb', 'photo-compress-100kb', 'photo-compress-200kb']
  },
  {
    id: 'crop-resize',
    title: 'Crop, Signature & Dimension Checkers',
    titleTa: 'க்ராப், கையொப்பம் & அளவீடு சரிபார்ப்பு',
    desc: 'Crop & compress signatures under 20 KB, resize pixels, inspect dimensions, and check PDF/image file sizes.',
    descTa: 'கையொப்பத்தை 20 KB-க்குள் சுருக்கவும், பிக்சல்களை மாற்றவும், PDF/பட அளவுகளைச் சரிபார்க்கவும்.',
    toolIds: ['signature-resize', 'dimension-checker', 'document-size-checker', 'photo-crop', 'photo-resizer']
  },
  {
    id: 'editor',
    title: 'Photo Enhancer & Backgrounds',
    titleTa: 'போட்டோ எடிட்டிங் & பின்னணி நிறம்',
    desc: 'Adjust brightness/contrast, rotate images, and replace solid portrait backdrops cleanly to white or light blue.',
    descTa: 'வெளிச்சத்தை சரிசெய்து, பின்னணி நிறத்தை வெள்ளை அல்லது வெளிர் நீலமாக மாற்றுங்கள்.',
    toolIds: ['photo-editor', 'photo-background-change']
  },
  {
    id: 'converter',
    title: 'Image Format Converters',
    titleTa: 'பட வடிவ மாற்றிகள் (JPG / PNG)',
    desc: 'Convert images cleanly between JPG, PNG, WEBP, and BMP locally in browser.',
    descTa: 'JPG, PNG மற்றும் WEBP படங்களை உடனடியாக மாற்றுங்கள்.',
    toolIds: ['photo-to-jpg', 'photo-to-png', 'jpg-to-png', 'png-to-jpg']
  },
  {
    id: 'pdf',
    title: 'PDF & Document Utilities',
    titleTa: 'PDF & ஆவணக் கருவிகள்',
    desc: 'Merge, split, extract, rotate, compress PDFs, render PDF pages to JPG, and create PDFs from JPG/PNG images.',
    descTa: 'PDF-களை இணைக்க, பிரிக்க, சுழற்ற, சுருக்க, மற்றும் JPG/PDF மாற்ற உதவும் 100% பிரவுசர் கருவிகள்.',
    toolIds: ['pdf-merge', 'pdf-split', 'pdf-extract', 'pdf-rotate', 'pdf-compress', 'pdf-to-jpg', 'jpg-to-pdf', 'png-to-pdf', 'image-to-pdf']
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
