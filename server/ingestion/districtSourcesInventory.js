// server/ingestion/districtSourcesInventory.js
// AK E-SEVAI 2 — PHASE B2-A: Tamil Nadu 38 District Government Recruitment Master Source Inventory
// Strict Official Government Domain Policy: Only .gov.in, .nic.in, .tn.gov.in, and verified official portals.
// NEVER trusts unverified blogs, job aggregator portals, or commercial coaching websites.

/**
 * 21 Standard Government Department & Local Body Classifications
 */
export const DISTRICT_DEPARTMENT_TYPES = [
  { id: 'district_collectorate', nameEn: 'District Collector Office', nameTa: 'மாவட்ட ஆட்சியர் அலுவலகம்', priority: 1 },
  { id: 'district_recruitment', nameEn: 'District Recruitment Notifications', nameTa: 'மாவட்ட ஆட்சேர்ப்பு அறிவிப்புகள்', priority: 1 },
  { id: 'revenue_department', nameEn: 'Revenue Department (Taluk / VAO)', nameTa: 'வருவாய்த்துறை (வட்டாட்சியர் / வி.ஏ.ஓ)', priority: 2 },
  { id: 'rural_development_panchayat_raj', nameEn: 'Rural Development & Panchayat Raj (DRDA)', nameTa: 'ஊரக வளர்ச்சி மற்றும் ஊராட்சித் துறை (DRDA)', priority: 2 },
  { id: 'panchayat_union', nameEn: 'Panchayat Union Offices (BDO)', nameTa: 'ஊராட்சி ஒன்றிய அலுவலகங்கள் (BDO)', priority: 3 },
  { id: 'village_panchayats', nameEn: 'Village Panchayats', nameTa: 'கிராம ஊராட்சிகள்', priority: 3 },
  { id: 'municipal_corporation', nameEn: 'Municipal Corporations', nameTa: 'மாநகராட்சிகள்', priority: 2 },
  { id: 'municipality', nameEn: 'Municipalities', nameTa: 'நகராட்சிகள்', priority: 3 },
  { id: 'town_panchayat', nameEn: 'Town Panchayats', nameTa: 'பேரூராட்சிகள்', priority: 4 },
  { id: 'district_health_society', nameEn: 'District Health Society (DHS / NHM)', nameTa: 'மாவட்ட நலவாழ்வு சங்கம் (DHS / NHM)', priority: 1 },
  { id: 'government_hospitals', nameEn: 'Government Hospitals / Medical Recruitment', nameTa: 'அரசு மருத்துவமனைகள் / மருத்துவ ஆட்சேர்ப்பு', priority: 2 },
  { id: 'school_education', nameEn: 'School Education Department (CEO)', nameTa: 'பள்ளிக் கல்வித்துறை (முதன்மை கல்வி அலுவலர்)', priority: 3 },
  { id: 'colleges_universities', nameEn: 'Government Colleges / Universities', nameTa: 'அரசு கல்லூரிகள் / பல்கலைக்கழகங்கள்', priority: 3 },
  { id: 'social_welfare', nameEn: 'Social Welfare & Women Empowerment (DCPU)', nameTa: 'சமூக நலன் & மகளிர் உரிமைத்துறை (DCPU / DSWO)', priority: 2 },
  { id: 'adi_dravidar_tribal_welfare', nameEn: 'Adi Dravidar and Tribal Welfare Department', nameTa: 'ஆதிதிராவிடர் மற்றும் பழங்குடியினர் நலத்துறை', priority: 3 },
  { id: 'agriculture_department', nameEn: 'Agriculture Department (JDA / ATMA)', nameTa: 'வேளாண்மைத் துறை (ATMA / JDA)', priority: 3 },
  { id: 'animal_husbandry', nameEn: 'Animal Husbandry Department', nameTa: 'கால்நடை பராமரிப்புத் துறை', priority: 4 },
  { id: 'fisheries_department', nameEn: 'Fisheries Department', nameTa: 'மீன்வளத்துறை', priority: 4 },
  { id: 'transport_department', nameEn: 'Transport Department (TNSTC)', nameTa: 'போக்குவரத்துத் துறை (TNSTC)', priority: 3 },
  { id: 'electricity_board', nameEn: 'Electricity (TANGEDCO / TNPDCL)', nameTa: 'மின்வாரியம் (TANGEDCO / TNPDCL)', priority: 3 },
  { id: 'other_institutions', nameEn: 'Other District Institutions (Courts / Police / Employment)', nameTa: 'பிற மாவட்ட அரசு அமைப்புகள் (நீதிமன்றங்கள் / காவல் / வேலைவாய்ப்பு)', priority: 2 }
];

/**
 * Master Registry of All 38 Tamil Nadu Districts
 */
export const TAMIL_NADU_38_DISTRICTS = [
  { id: 'ariyalur', nameEn: 'Ariyalur', nameTa: 'அரியலூர்', hq: 'Ariyalur', region: 'Central', domain: 'ariyalur.nic.in', portalUrl: 'https://ariyalur.nic.in/', recruitmentUrl: 'https://ariyalur.nic.in/notice_category/recruitment/' },
  { id: 'chengalpattu', nameEn: 'Chengalpattu', nameTa: 'செங்கல்பட்டு', hq: 'Chengalpattu', region: 'North', domain: 'chengalpattu.nic.in', portalUrl: 'https://chengalpattu.nic.in/', recruitmentUrl: 'https://chengalpattu.nic.in/notice_category/recruitment/' },
  { id: 'chennai', nameEn: 'Chennai', nameTa: 'சென்னை', hq: 'Chennai', region: 'North', domain: 'chennai.nic.in', portalUrl: 'https://chennai.nic.in/', recruitmentUrl: 'https://chennai.nic.in/notice_category/recruitment/' },
  { id: 'coimbatore', nameEn: 'Coimbatore', nameTa: 'கோயம்புத்தூர்', hq: 'Coimbatore', region: 'West', domain: 'coimbatore.nic.in', portalUrl: 'https://coimbatore.nic.in/', recruitmentUrl: 'https://coimbatore.nic.in/notice_category/recruitment/' },
  { id: 'cuddalore', nameEn: 'Cuddalore', nameTa: 'கடலூர்', hq: 'Cuddalore', region: 'Central', domain: 'cuddalore.nic.in', portalUrl: 'https://cuddalore.nic.in/', recruitmentUrl: 'https://cuddalore.nic.in/notice_category/recruitment/' },
  { id: 'dharmapuri', nameEn: 'Dharmapuri', nameTa: 'தருமபுரி', hq: 'Dharmapuri', region: 'West', domain: 'dharmapuri.nic.in', portalUrl: 'https://dharmapuri.nic.in/', recruitmentUrl: 'https://dharmapuri.nic.in/notice_category/recruitment/' },
  { id: 'dindigul', nameEn: 'Dindigul', nameTa: 'திண்டுக்கல்', hq: 'Dindigul', region: 'South', domain: 'dindigul.nic.in', portalUrl: 'https://dindigul.nic.in/', recruitmentUrl: 'https://dindigul.nic.in/notice_category/recruitment/' },
  { id: 'erode', nameEn: 'Erode', nameTa: 'ஈரோடு', hq: 'Erode', region: 'West', domain: 'erode.nic.in', portalUrl: 'https://erode.nic.in/', recruitmentUrl: 'https://erode.nic.in/notice_category/recruitment/' },
  { id: 'kallakurichi', nameEn: 'Kallakurichi', nameTa: 'கள்ளக்குறிச்சி', hq: 'Kallakurichi', region: 'North', domain: 'kallakurichi.nic.in', portalUrl: 'https://kallakurichi.nic.in/', recruitmentUrl: 'https://kallakurichi.nic.in/notice_category/recruitment/' },
  { id: 'kancheepuram', nameEn: 'Kancheepuram', nameTa: 'காஞ்சிபுரம்', hq: 'Kancheepuram', region: 'North', domain: 'kancheepuram.nic.in', portalUrl: 'https://kancheepuram.nic.in/', recruitmentUrl: 'https://kancheepuram.nic.in/notice_category/recruitment/' },
  { id: 'kanniyakumari', nameEn: 'Kanniyakumari', nameTa: 'கன்னியாகுமரி', hq: 'Nagercoil', region: 'South', domain: 'kanniyakumari.nic.in', portalUrl: 'https://kanniyakumari.nic.in/', recruitmentUrl: 'https://kanniyakumari.nic.in/notice_category/recruitment/' },
  { id: 'karur', nameEn: 'Karur', nameTa: 'கரூர்', hq: 'Karur', region: 'Central', domain: 'karur.nic.in', portalUrl: 'https://karur.nic.in/', recruitmentUrl: 'https://karur.nic.in/notice_category/recruitment/' },
  { id: 'krishnagiri', nameEn: 'Krishnagiri', nameTa: 'கிருஷ்ணகிரி', hq: 'Krishnagiri', region: 'West', domain: 'krishnagiri.nic.in', portalUrl: 'https://krishnagiri.nic.in/', recruitmentUrl: 'https://krishnagiri.nic.in/notice_category/recruitment/' },
  { id: 'madurai', nameEn: 'Madurai', nameTa: 'மதுரை', hq: 'Madurai', region: 'South', domain: 'madurai.nic.in', portalUrl: 'https://madurai.nic.in/', recruitmentUrl: 'https://madurai.nic.in/notice_category/recruitment/' },
  { id: 'mayiladuthurai', nameEn: 'Mayiladuthurai', nameTa: 'மயிலாடுதுறை', hq: 'Mayiladuthurai', region: 'Central', domain: 'mayiladuthurai.nic.in', portalUrl: 'https://mayiladuthurai.nic.in/', recruitmentUrl: 'https://mayiladuthurai.nic.in/notice_category/recruitment/' },
  { id: 'nagapattinam', nameEn: 'Nagapattinam', nameTa: 'நாகப்பட்டினம்', hq: 'Nagapattinam', region: 'Central', domain: 'nagapattinam.nic.in', portalUrl: 'https://nagapattinam.nic.in/', recruitmentUrl: 'https://nagapattinam.nic.in/notice_category/recruitment/' },
  { id: 'namakkal', nameEn: 'Namakkal', nameTa: 'நாமக்கல்', hq: 'Namakkal', region: 'West', domain: 'namakkal.nic.in', portalUrl: 'https://namakkal.nic.in/', recruitmentUrl: 'https://namakkal.nic.in/notice_category/recruitment/' },
  { id: 'nilgiris', nameEn: 'Nilgiris', nameTa: 'நீலகிரி', hq: 'Udhagamandalam (Ooty)', region: 'West', domain: 'nilgiris.nic.in', portalUrl: 'https://nilgiris.nic.in/', recruitmentUrl: 'https://nilgiris.nic.in/notice_category/recruitment/' },
  { id: 'perambalur', nameEn: 'Perambalur', nameTa: 'பெரம்பலூர்', hq: 'Perambalur', region: 'Central', domain: 'perambalur.nic.in', portalUrl: 'https://perambalur.nic.in/', recruitmentUrl: 'https://perambalur.nic.in/notice_category/recruitment/' },
  { id: 'pudukkottai', nameEn: 'Pudukkottai', nameTa: 'புதுக்கோட்டை', hq: 'Pudukkottai', region: 'Central', domain: 'pudukkottai.nic.in', portalUrl: 'https://pudukkottai.nic.in/', recruitmentUrl: 'https://pudukkottai.nic.in/notice_category/recruitment/' },
  { id: 'ramanathapuram', nameEn: 'Ramanathapuram', nameTa: 'இராமநாதபுரம்', hq: 'Ramanathapuram', region: 'South', domain: 'ramanathapuram.nic.in', portalUrl: 'https://ramanathapuram.nic.in/', recruitmentUrl: 'https://ramanathapuram.nic.in/notice_category/recruitment/' },
  { id: 'ranipet', nameEn: 'Ranipet', nameTa: 'இராணிப்பேட்டை', hq: 'Ranipet', region: 'North', domain: 'ranipet.nic.in', portalUrl: 'https://ranipet.nic.in/', recruitmentUrl: 'https://ranipet.nic.in/notice_category/recruitment/' },
  { id: 'salem', nameEn: 'Salem', nameTa: 'சேலம்', hq: 'Salem', region: 'West', domain: 'salem.nic.in', portalUrl: 'https://salem.nic.in/', recruitmentUrl: 'https://salem.nic.in/notice_category/recruitment/' },
  { id: 'sivaganga', nameEn: 'Sivaganga', nameTa: 'சிவகங்கை', hq: 'Sivaganga', region: 'South', domain: 'sivaganga.nic.in', portalUrl: 'https://sivaganga.nic.in/', recruitmentUrl: 'https://sivaganga.nic.in/notice_category/recruitment/' },
  { id: 'tenkasi', nameEn: 'Tenkasi', nameTa: 'தென்காசி', hq: 'Tenkasi', region: 'South', domain: 'tenkasi.nic.in', portalUrl: 'https://tenkasi.nic.in/', recruitmentUrl: 'https://tenkasi.nic.in/notice_category/recruitment/' },
  { id: 'thanjavur', nameEn: 'Thanjavur', nameTa: 'தஞ்சாவூர்', hq: 'Thanjavur', region: 'Central', domain: 'thanjavur.nic.in', portalUrl: 'https://thanjavur.nic.in/', recruitmentUrl: 'https://thanjavur.nic.in/notice_category/recruitment/' },
  { id: 'theni', nameEn: 'Theni', nameTa: 'தேனி', hq: 'Theni', region: 'South', domain: 'theni.nic.in', portalUrl: 'https://theni.nic.in/', recruitmentUrl: 'https://theni.nic.in/notice_category/recruitment/' },
  { id: 'thoothukudi', nameEn: 'Thoothukudi', nameTa: 'தூத்துக்குடி', hq: 'Thoothukudi', region: 'South', domain: 'thoothukudi.nic.in', portalUrl: 'https://thoothukudi.nic.in/', recruitmentUrl: 'https://thoothukudi.nic.in/notice_category/recruitment/' },
  { id: 'tiruchirappalli', nameEn: 'Tiruchirappalli', nameTa: 'திருச்சிராப்பள்ளி', hq: 'Tiruchirappalli', region: 'Central', domain: 'tiruchirappalli.nic.in', portalUrl: 'https://tiruchirappalli.nic.in/', recruitmentUrl: 'https://tiruchirappalli.nic.in/notice_category/recruitment/' },
  { id: 'tirunelveli', nameEn: 'Tirunelveli', nameTa: 'திருநெல்வேலி', hq: 'Tirunelveli', region: 'South', domain: 'tirunelveli.nic.in', portalUrl: 'https://tirunelveli.nic.in/', recruitmentUrl: 'https://tirunelveli.nic.in/notice_category/recruitment/' },
  { id: 'tirupathur', nameEn: 'Tirupathur', nameTa: 'திருப்பத்தூர்', hq: 'Tirupathur', region: 'North', domain: 'tirupathur.nic.in', portalUrl: 'https://tirupathur.nic.in/', recruitmentUrl: 'https://tirupathur.nic.in/notice_category/recruitment/' },
  { id: 'tiruppur', nameEn: 'Tiruppur', nameTa: 'திருப்பூர்', hq: 'Tiruppur', region: 'West', domain: 'tiruppur.nic.in', portalUrl: 'https://tiruppur.nic.in/', recruitmentUrl: 'https://tiruppur.nic.in/notice_category/recruitment/' },
  { id: 'tiruvallur', nameEn: 'Tiruvallur', nameTa: 'திருவள்ளூர்', hq: 'Tiruvallur', region: 'North', domain: 'tiruvallur.nic.in', portalUrl: 'https://tiruvallur.nic.in/', recruitmentUrl: 'https://tiruvallur.nic.in/notice_category/recruitment/' },
  { id: 'tiruvannamalai', nameEn: 'Tiruvannamalai', nameTa: 'திருவண்ணாமலை', hq: 'Tiruvannamalai', region: 'North', domain: 'tiruvannamalai.nic.in', portalUrl: 'https://tiruvannamalai.nic.in/', recruitmentUrl: 'https://tiruvannamalai.nic.in/notice_category/recruitment/' },
  { id: 'tiruvarur', nameEn: 'Tiruvarur', nameTa: 'திருவாரூர்', hq: 'Tiruvarur', region: 'Central', domain: 'tiruvarur.nic.in', portalUrl: 'https://tiruvarur.nic.in/', recruitmentUrl: 'https://tiruvarur.nic.in/notice_category/recruitment/' },
  { id: 'vellore', nameEn: 'Vellore', nameTa: 'வேலூர்', hq: 'Vellore', region: 'North', domain: 'vellore.nic.in', portalUrl: 'https://vellore.nic.in/', recruitmentUrl: 'https://vellore.nic.in/notice_category/recruitment/' },
  { id: 'viluppuram', nameEn: 'Viluppuram', nameTa: 'விழுப்புரம்', hq: 'Viluppuram', region: 'North', domain: 'viluppuram.nic.in', portalUrl: 'https://viluppuram.nic.in/', recruitmentUrl: 'https://viluppuram.nic.in/notice_category/recruitment/' },
  { id: 'virudhunagar', nameEn: 'Virudhunagar', nameTa: 'விருதுநகர்', hq: 'Virudhunagar', region: 'South', domain: 'virudhunagar.nic.in', portalUrl: 'https://virudhunagar.nic.in/', recruitmentUrl: 'https://virudhunagar.nic.in/notice_category/recruitment/' }
];

/**
 * Verified Municipal Corporation Portals in Tamil Nadu
 */
export const TAMIL_NADU_MUNICIPAL_CORPORATIONS = [
  { id: 'gcc_chennai', districtId: 'chennai', nameEn: 'Greater Chennai Corporation (GCC)', nameTa: 'பெருநகர சென்னை மாநகராட்சி', portalUrl: 'https://chennaicorporation.gov.in/', recruitmentUrl: 'https://chennaicorporation.gov.in/gcc/recruitment/', domain: 'chennaicorporation.gov.in', status: 'OFFICIAL_URL_VERIFIED' },
  { id: 'ccmc_coimbatore', districtId: 'coimbatore', nameEn: 'Coimbatore City Municipal Corporation (CCMC)', nameTa: 'கோயம்புத்தூர் மாநகராட்சி', portalUrl: 'https://www.ccmc.gov.in/', recruitmentUrl: 'https://www.ccmc.gov.in/ccmc/index.php/recruitment', domain: 'ccmc.gov.in', status: 'OFFICIAL_URL_VERIFIED' },
  { id: 'mcm_madurai', districtId: 'madurai', nameEn: 'Madurai Corporation', nameTa: 'மதுரை மாநகராட்சி', portalUrl: 'https://www.maduraicorporation.co.in/', recruitmentUrl: 'https://www.maduraicorporation.co.in/', domain: 'maduraicorporation.co.in', status: 'OFFICIAL_URL_VERIFIED' },
  { id: 'tcmc_trichy', districtId: 'tiruchirappalli', nameEn: 'Tiruchirappalli City Corporation', nameTa: 'திருச்சிராப்பள்ளி மாநகராட்சி', portalUrl: 'https://trichycorporation.gov.in/', recruitmentUrl: 'https://trichycorporation.gov.in/', domain: 'trichycorporation.gov.in', status: 'OFFICIAL_URL_VERIFIED' },
  { id: 'salem_corp', districtId: 'salem', nameEn: 'Salem Corporation', nameTa: 'சேலம் மாநகராட்சி', portalUrl: 'https://salemcorporation.gov.in/', recruitmentUrl: 'https://salemcorporation.gov.in/', domain: 'salemcorporation.gov.in', status: 'OFFICIAL_URL_VERIFIED' },
  { id: 'tiruppur_corp', districtId: 'tiruppur', nameEn: 'Tiruppur City Municipal Corporation', nameTa: 'திருப்பூர் மாநகராட்சி', portalUrl: 'https://tiruppurcorporation.tn.gov.in/', recruitmentUrl: 'https://tiruppurcorporation.tn.gov.in/', domain: 'tiruppurcorporation.tn.gov.in', status: 'OFFICIAL_URL_VERIFIED' },
  { id: 'erode_corp', districtId: 'erode', nameEn: 'Erode City Municipal Corporation', nameTa: 'ஈரோடு மாநகராட்சி', portalUrl: 'https://erodecorporation.tn.gov.in/', recruitmentUrl: 'https://erodecorporation.tn.gov.in/', domain: 'erodecorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' },
  { id: 'tirunelveli_corp', districtId: 'tirunelveli', nameEn: 'Tirunelveli Municipal Corporation', nameTa: 'திருநெல்வேலி மாநகராட்சி', portalUrl: 'https://tirunelvelicorporation.tn.gov.in/', recruitmentUrl: 'https://tirunelvelicorporation.tn.gov.in/', domain: 'tirunelvelicorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' },
  { id: 'dindigul_corp', districtId: 'dindigul', nameEn: 'Dindigul City Corporation', nameTa: 'திண்டுக்கல் மாநகராட்சி', portalUrl: 'https://dindigulcorporation.tn.gov.in/', recruitmentUrl: 'https://dindigulcorporation.tn.gov.in/', domain: 'dindigulcorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' },
  { id: 'thanjavur_corp', districtId: 'thanjavur', nameEn: 'Thanjavur City Corporation', nameTa: 'தஞ்சாவூர் மாநகராட்சி', portalUrl: 'https://thanjavurcorporation.tn.gov.in/', recruitmentUrl: 'https://thanjavurcorporation.tn.gov.in/', domain: 'thanjavurcorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' },
  { id: 'vellore_corp', districtId: 'vellore', nameEn: 'Vellore City Corporation', nameTa: 'வேலூர் மாநகராட்சி', portalUrl: 'https://vellorecorporation.tn.gov.in/', recruitmentUrl: 'https://vellorecorporation.tn.gov.in/', domain: 'vellorecorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' },
  { id: 'thoothukudi_corp', districtId: 'thoothukudi', nameEn: 'Thoothukudi City Corporation', nameTa: 'தூத்துக்குடி மாநகராட்சி', portalUrl: 'https://thoothukudicorporation.tn.gov.in/', recruitmentUrl: 'https://thoothukudicorporation.tn.gov.in/', domain: 'thoothukudicorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' },
  { id: 'nagercoil_corp', districtId: 'kanniyakumari', nameEn: 'Nagercoil City Corporation', nameTa: 'நாகர்கோவில் மாநகராட்சி', portalUrl: 'https://nagercoilcorporation.tn.gov.in/', recruitmentUrl: 'https://nagercoilcorporation.tn.gov.in/', domain: 'nagercoilcorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' },
  { id: 'hosur_corp', districtId: 'krishnagiri', nameEn: 'Hosur City Corporation', nameTa: 'ஓசூர் மாநகராட்சி', portalUrl: 'https://hosurcorporation.tn.gov.in/', recruitmentUrl: 'https://hosurcorporation.tn.gov.in/', domain: 'hosurcorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' },
  { id: 'tambaram_corp', districtId: 'chengalpattu', nameEn: 'Tambaram City Corporation', nameTa: 'தாம்பரம் மாநகராட்சி', portalUrl: 'https://tambaramcorporation.tn.gov.in/', recruitmentUrl: 'https://tambaramcorporation.tn.gov.in/', domain: 'tambaramcorporation.tn.gov.in', status: 'OFFICIAL_URL_VERIFIED' },
  { id: 'avadi_corp', districtId: 'tiruvallur', nameEn: 'Avadi City Corporation', nameTa: 'ஆவடி மாநகராட்சி', portalUrl: 'https://avadicorporation.tn.gov.in/', recruitmentUrl: 'https://avadicorporation.tn.gov.in/', domain: 'avadicorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' },
  { id: 'kancheepuram_corp', districtId: 'kancheepuram', nameEn: 'Kancheepuram City Corporation', nameTa: 'காஞ்சிபுரம் மாநகராட்சி', portalUrl: 'https://kancheepuramcorporation.tn.gov.in/', recruitmentUrl: 'https://kancheepuramcorporation.tn.gov.in/', domain: 'kancheepuramcorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' },
  { id: 'karur_corp', districtId: 'karur', nameEn: 'Karur City Corporation', nameTa: 'கரூர் மாநகராட்சி', portalUrl: 'https://karurcorporation.tn.gov.in/', recruitmentUrl: 'https://karurcorporation.tn.gov.in/', domain: 'karurcorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' },
  { id: 'cuddalore_corp', districtId: 'cuddalore', nameEn: 'Cuddalore City Corporation', nameTa: 'கடலூர் மாநகராட்சி', portalUrl: 'https://cuddalorecorporation.tn.gov.in/', recruitmentUrl: 'https://cuddalorecorporation.tn.gov.in/', domain: 'cuddalorecorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' },
  { id: 'kumbakonam_corp', districtId: 'thanjavur', nameEn: 'Kumbakonam City Corporation', nameTa: 'கும்பகோணம் மாநகராட்சி', portalUrl: 'https://kumbakonamcorporation.tn.gov.in/', recruitmentUrl: 'https://kumbakonamcorporation.tn.gov.in/', domain: 'kumbakonamcorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' },
  { id: 'sivakasi_corp', districtId: 'virudhunagar', nameEn: 'Sivakasi City Corporation', nameTa: 'சிவகாசி மாநகராட்சி', portalUrl: 'https://sivakasicorporation.tn.gov.in/', recruitmentUrl: 'https://sivakasicorporation.tn.gov.in/', domain: 'sivakasicorporation.tn.gov.in', status: 'NEEDS_OFFICIAL_SOURCE' }
];

/**
 * Master 38 District Sources Registry Builder
 * Constructs comprehensive source catalog for all 38 districts across Collectorate, Health, Courts, DRDA, etc.
 */
export function buildDistrictOfficialSourcesRegistry() {
  const sources = [];

  for (const d of TAMIL_NADU_38_DISTRICTS) {
    // 1. Primary S3WaaS District Collectorate Portal (Aggregator for Revenue, DRDA, DCPU, ATMA, DHS)
    sources.push({
      sourceKey: `dist_${d.id}_collectorate`,
      districtId: d.id,
      districtNameEn: d.nameEn,
      districtNameTa: d.nameTa,
      departmentId: 'district_collectorate',
      departmentNameEn: 'District Collector Office',
      departmentNameTa: 'மாவட்ட ஆட்சியர் அலுவலகம்',
      organization: `${d.nameEn} District Administration`,
      officialWebsiteUrl: d.portalUrl,
      recruitmentUrl: d.recruitmentUrl,
      sourceType: 'html_s3waas_table',
      enabled: false,
      status: 'NEEDS_MANUAL_REVIEW',
      pdfAvailability: 'direct_pdf',
      scrapingMethod: 's3waas_table_extract',
      updateFrequency: 'daily',
      requiresManualReview: true,
      officialDomainPattern: d.domain,
      notes: `Primary NIC S3WaaS portal. Publishes Collectorate, DHS, DCPU, DRDA, ATMA and Revenue recruitment notifications.`
    });

    // 2. District Health Society (DHS / NHM)
    sources.push({
      sourceKey: `dist_${d.id}_health_society`,
      districtId: d.id,
      districtNameEn: d.nameEn,
      districtNameTa: d.nameTa,
      departmentId: 'district_health_society',
      departmentNameEn: 'District Health Society (DHS / NHM)',
      departmentNameTa: 'மாவட்ட நலவாழ்வு சங்கம்',
      organization: `${d.nameEn} District Health Society (NHM Tamil Nadu)`,
      officialWebsiteUrl: d.portalUrl,
      recruitmentUrl: d.recruitmentUrl,
      sourceType: 'html_s3waas_table',
      enabled: false,
      status: 'NEEDS_MANUAL_REVIEW',
      pdfAvailability: 'direct_pdf',
      scrapingMethod: 's3waas_table_extract',
      updateFrequency: 'daily',
      requiresManualReview: true,
      officialDomainPattern: d.domain,
      notes: `Medical Officers, Staff Nurses, Lab Technicians, Block Data Managers. Published via district portal.`
    });

    // 3. District Rural Development Agency (DRDA / Panchayat Unions)
    sources.push({
      sourceKey: `dist_${d.id}_drda`,
      districtId: d.id,
      districtNameEn: d.nameEn,
      districtNameTa: d.nameTa,
      departmentId: 'rural_development_panchayat_raj',
      departmentNameEn: 'District Rural Development Agency (DRDA)',
      departmentNameTa: 'மாவட்ட ஊரக வளர்ச்சி முகமை',
      organization: `${d.nameEn} DRDA & Panchayat Unions`,
      officialWebsiteUrl: d.portalUrl,
      recruitmentUrl: d.recruitmentUrl,
      sourceType: 'html_s3waas_table',
      enabled: false,
      status: 'NEEDS_MANUAL_REVIEW',
      pdfAvailability: 'direct_pdf',
      scrapingMethod: 's3waas_table_extract',
      updateFrequency: 'weekly',
      requiresManualReview: true,
      officialDomainPattern: d.domain,
      notes: `Road Overseers, Overseer/Junior Draughting Officer, Panchayat Secretary recruitments.`
    });

    // 4. District Courts / eCourts Project
    const ecourtUrl = `https://districts.ecourts.gov.in/${d.id}`;
    sources.push({
      sourceKey: `dist_${d.id}_ecourts`,
      districtId: d.id,
      districtNameEn: d.nameEn,
      districtNameTa: d.nameTa,
      departmentId: 'other_institutions',
      departmentNameEn: 'District & Sessions Court (eCourts)',
      departmentNameTa: 'மாவட்ட முதன்மை நீதிமன்றம்',
      organization: `${d.nameEn} District Judiciary / eCourts Services`,
      officialWebsiteUrl: ecourtUrl,
      recruitmentUrl: `${ecourtUrl}/recruitment/`,
      sourceType: 'ecourts_recruitment_table',
      enabled: false,
      status: 'NEEDS_MANUAL_REVIEW',
      pdfAvailability: 'direct_pdf',
      scrapingMethod: 'ecourts_scraper',
      updateFrequency: 'biweekly',
      requiresManualReview: true,
      officialDomainPattern: 'districts.ecourts.gov.in',
      notes: `Office Assistant, Typist, Steno-Typist, Bailiff, Examiner judicial posts.`
    });
  }

  // 5. Add Municipal Corporations
  for (const corp of TAMIL_NADU_MUNICIPAL_CORPORATIONS) {
    sources.push({
      sourceKey: `corp_${corp.id}`,
      districtId: corp.districtId,
      districtNameEn: TAMIL_NADU_38_DISTRICTS.find(d => d.id === corp.districtId)?.nameEn || corp.districtId,
      districtNameTa: TAMIL_NADU_38_DISTRICTS.find(d => d.id === corp.districtId)?.nameTa || corp.districtId,
      departmentId: 'municipal_corporation',
      departmentNameEn: 'Municipal Corporation',
      departmentNameTa: 'மாநகராட்சி',
      organization: corp.nameEn,
      officialWebsiteUrl: corp.portalUrl,
      recruitmentUrl: corp.recruitmentUrl,
      sourceType: 'municipal_corp_portal',
      enabled: false,
      status: 'NEEDS_MANUAL_REVIEW',
      pdfAvailability: 'direct_pdf',
      scrapingMethod: 'html_cards',
      updateFrequency: 'weekly',
      requiresManualReview: true,
      officialDomainPattern: corp.domain,
      notes: `Direct city municipal corporation recruitment for health, engineering, revenue and sanitation roles.`
    });
  }

  return sources;
}

export const DISTRICT_OFFICIAL_SOURCES_REGISTRY = buildDistrictOfficialSourcesRegistry();
