import { BUSINESS_HOURS_CONFIG, getOperationalStatus, isWithinBusinessHours } from './businessHours.js';

export const siteConfig = {
  name: 'AK E-SEVAI Digital Service Centre',
  shortName: 'AK E-SEVAI',
  tagline: 'Digital Service Centre',
  address: 'AK E-SEVAI Digital Service Centre, Mill Road, Sanmugapuram, Anna Nagar, Palani, Tamil Nadu 624601',
  phone: '9342318844',
  displayPhone: '+91 93423 18844',
  e164Phone: '+919342318844',
  email: 'akesevaipalani@gmail.com',
  youtube: 'https://www.youtube.com/@AkEsevai',
  instagram: 'https://www.instagram.com/akesevai',
  facebook: 'https://www.facebook.com/share/19EzFFHata/',
  hours: BUSINESS_HOURS_CONFIG.displayHoursEn,
  hoursTamil: BUSINESS_HOURS_CONFIG.displayHoursTa,
  whatsapp: 'https://wa.me/919342318844',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=AK+E-SEVAI+Digital+Service+Centre%2C+Mill+Road%2C+Sanmugapuram%2C+Anna+Nagar%2C+Palani%2C+Tamil+Nadu+624601',
  embedMapUrl: 'https://maps.google.com/maps?q=AK+E-SEVAI+Digital+Service+Centre%2C+Mill+Road%2C+Sanmugapuram%2C+Anna+Nagar%2C+Palani%2C+Tamil+Nadu+624601&t=&z=17&ie=UTF8&iwloc=&output=embed',
  getOperationalStatus,
  isWithinBusinessHours
};
