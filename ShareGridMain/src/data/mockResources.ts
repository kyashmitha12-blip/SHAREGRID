import { ResourceItem, ResourceCategory } from '../types/resource';

export const CATEGORY_DEFINITIONS: { id: ResourceCategory; label: string; count?: number }[] = [
  { id: 'all', label: 'All Resources' },
  { id: 'equipment-tools', label: 'Equipment & Tools' },
  { id: 'laboratory-equipment', label: 'Laboratory Equipment' },
  { id: 'presentation-projectors', label: 'Projectors & Presentation' },
  { id: 'cameras-microphones', label: 'Cameras & Microphones' },
  { id: 'arduino-iot-kits', label: 'Arduino & IoT Kits' },
  { id: 'cnc-fabrication', label: 'CNC & Fabrication Tools' },
  { id: 'spaces-meeting-rooms', label: 'Research Spaces & Rooms' },
  { id: 'computers-hardware', label: 'Computers & Specialised HW' },
];

export const CAMPUS_LIST = [
  'All Campuses',
  'IIT Bombay (Powai, Mumbai)',
  'IISc Bangalore (Malleshwaram, Bengaluru)',
  'IIT Madras (Guindy, Chennai)',
  'IIT Delhi (Hauz Khas, New Delhi)',
  'BITS Pilani (K.K. Birla Goa Campus)',
  'NCBS / TIFR (GKVK, Bengaluru)',
  'AIIMS (Ansari Nagar, New Delhi)',
  'NID (Paldi, Ahmedabad)'
];

export const CONDITION_OPTIONS = [
  { value: 'all', label: 'All Conditions' },
  { value: 'new', label: 'Like New / Mint' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good Working Condition' },
  { value: 'certified', label: 'NABL Calibrated / Certified' },
];

export const APPROVAL_OPTIONS = [
  { value: 'all', label: 'All Approvals' },
  { value: 'instant', label: 'Instant Booking' },
  { value: 'host-approval', label: 'Host Approval Required' },
  { value: 'dept-signoff', label: 'Department Head Sign-off' },
];

const DEFAULT_SCHEDULE = [
  {
    date: '2026-11-04',
    dayLabel: 'Wednesday, 04 Nov',
    slots: [
      { id: 's1', time: '09:00 - 11:00', available: true },
      { id: 's2', time: '11:30 - 13:30', available: true },
      { id: 's3', time: '14:00 - 16:00', available: false },
      { id: 's4', time: '16:30 - 18:30', available: true }
    ]
  },
  {
    date: '2026-11-05',
    dayLabel: 'Thursday, 05 Nov',
    slots: [
      { id: 's5', time: '09:00 - 11:00', available: true },
      { id: 's6', time: '11:30 - 13:30', available: false },
      { id: 's7', time: '14:00 - 16:00', available: true },
      { id: 's8', time: '16:30 - 18:30', available: true }
    ]
  },
  {
    date: '2026-11-06',
    dayLabel: 'Friday, 06 Nov',
    slots: [
      { id: 's9', time: '09:00 - 11:00', available: false },
      { id: 's10', time: '11:30 - 13:30', available: true },
      { id: 's11', time: '14:00 - 16:00', available: true },
      { id: 's12', time: '16:30 - 18:30', available: true }
    ]
  }
];

export const MOCK_RESOURCES: ResourceItem[] = [
  // 1. Equipment & Tools
  {
    id: 'res-fluke-8846a',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'Fluke 8846A 6.5 Digit Precision Multimeter & Calibration Bench',
    code: 'TOOL-EL-01',
    category: 'equipment-tools',
    categoryLabel: 'Equipment & Tools',
    description: 'NABL-calibrated precision 6.5-digit benchtop digital multimeter with graphical trendplot recorder and 0.0024% basic V DC accuracy for microelectronics.',
    longDescription: 'Features dual measurement display for observing volt and amp fluctuations simultaneously. Includes calibrated test leads, 4-wire resistance Kelvin probes, and IEEE-488 GPIB interface for automated test bench telemetry.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'IIT Bombay',
      department: 'Department of Electrical Engineering',
      campus: 'IIT Bombay (Powai, Mumbai)',
      verified: true,
      rating: 4.95,
      totalShares: 142
    },
    location: {
      building: 'GG Building, EE Annex',
      campus: 'IIT Bombay (Powai, Mumbai)',
      city: 'Mumbai',
      room: 'Lab EE-204'
    },
    pricing: {
      hourlyRate: 350,
      dailyRate: 2200,
      currency: '₹',
      billingType: 'hourly',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Display Resolution', value: '6.5 Digits' },
      { label: 'DC Accuracy', value: '0.0024%' },
      { label: 'Sample Rate', value: 'Up to 50,000 readings/s' },
      { label: 'Calibration', value: 'NABL Certified 2026' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Today at 14:00 IST',
      leadTimeDays: 0,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'certified',
    conditionLabel: 'NABL Calibrated / Certified',
    approvalRequirement: 'instant',
    approvalLabel: 'Instant Booking',
    usageConditions: {
      cancellationPolicy: 'Free cancellation up to 4 hours before session start.',
      depositRequired: 'None for verified university researchers.',
      allowedUsage: ['Low-voltage microelectronics testing', 'Sensor characterization', 'M.Tech / PhD thesis capstones']
    },
    eligibilityRequirements: {
      affiliationRequired: ['IIT / IISc / NIT Student', 'Faculty Researcher', 'Recognized Incubator Startup'],
      safetyCertifications: ['Basic Electrical Safety Induction (EE-101)'],
      minimumUserLevel: 'Undergraduate or above'
    },
    operatorAssistance: false,
    certificationRequired: false,
    featured: false
  },
  {
    id: 'res-mitutoyo-cmm',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'Mitutoyo Crysta-Apex V 9106 CNC Coordinate Measuring Machine',
    code: 'TOOL-MET-03',
    category: 'equipment-tools',
    categoryLabel: 'Equipment & Tools',
    description: 'High-precision coordinate measuring machine with Renishaw SP25M scanning probe for sub-micron tolerance dimensional inspection of aerospace parts.',
    longDescription: 'Features temperature compensation from 16°C to 26°C with real-time expansion coefficient correction. Supported by MCOSMOS geometry inspection software with CAD model comparison capability.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'IIT Madras',
      department: 'Central Workshop & Metrology Lab',
      campus: 'IIT Madras (Guindy, Chennai)',
      verified: true,
      rating: 4.97,
      totalShares: 112
    },
    location: {
      building: 'Mechanical Engineering Complex',
      campus: 'IIT Madras (Guindy, Chennai)',
      city: 'Chennai',
      room: 'Metrology Bay 1'
    },
    pricing: {
      hourlyRate: 1200,
      dailyRate: 7500,
      currency: '₹',
      billingType: 'hourly',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Measuring Range', value: '900 x 1000 x 600 mm' },
      { label: 'Length Accuracy', value: 'E0,MPE = 1.7 + 3L/1000 µm' },
      { label: 'Drive Speed', value: '519 mm/s max 3D speed' },
      { label: 'Probe System', value: 'Renishaw SP25M Scanning' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Tomorrow at 10:00 IST',
      leadTimeDays: 1,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'certified',
    conditionLabel: 'NABL Calibrated / Certified',
    approvalRequirement: 'host-approval',
    approvalLabel: 'Host Approval Required',
    usageConditions: {
      cancellationPolicy: '24-hour advance notice required to avoid 50% reservation fee.',
      depositRequired: '₹1,500 refundable inspection deposit for commercial users.',
      allowedUsage: ['Precision aerospace, ISRO/DRDO, and biomedical prototype inspection']
    },
    eligibilityRequirements: {
      affiliationRequired: ['Accredited University / Institute', 'Aerospace / Defense Researcher', 'Hardware Incubator'],
      safetyCertifications: ['Clean Metrology Protocol Level 2'],
      minimumUserLevel: 'Graduate researcher or trained QA technician'
    },
    operatorAssistance: true,
    certificationRequired: true,
    featured: true
  },

  // 2. Laboratory Equipment
  {
    id: 'res-fe-sem-7900',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'JEOL JSM-7900F Field Emission Scanning Electron Microscope',
    code: 'LAB-SEM-08',
    category: 'laboratory-equipment',
    categoryLabel: 'Laboratory Equipment',
    description: 'Ultra-high resolution field emission SEM equipped with dual Oxford EDS detectors, cryo-stage transfer, and sub-nanometer beam stability for advanced materials.',
    longDescription: 'The JSM-7900F combines extreme stability with ultra-low landing energy imaging. Features GBS (Gentle Beam Supercharge) to reduce sample charging artifacts on biological or delicate polymer surfaces without conductive sputter coating.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'IISc Bangalore',
      department: 'Centre for Nano Science and Engineering (CeNSE)',
      campus: 'IISc Bangalore (Malleshwaram, Bengaluru)',
      verified: true,
      rating: 4.98,
      totalShares: 210
    },
    location: {
      building: 'CeNSE Nano Building, Level -1',
      campus: 'IISc Bangalore (Malleshwaram, Bengaluru)',
      city: 'Bengaluru',
      room: 'EM-Suite 102'
    },
    pricing: {
      hourlyRate: 1800,
      dailyRate: 11500,
      currency: '₹',
      billingType: 'hourly',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Resolution', value: '0.6 nm at 15 kV' },
      { label: 'Accelerating Voltage', value: '0.01 to 30 kV' },
      { label: 'Detector Array', value: 'Dual Oxford Ultim Max EDS' },
      { label: 'Sample Stage', value: '5-Axis motorized eucentric' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Tomorrow at 09:00 IST',
      leadTimeDays: 1,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'excellent',
    conditionLabel: 'Excellent',
    approvalRequirement: 'host-approval',
    approvalLabel: 'Host Approval Required',
    usageConditions: {
      cancellationPolicy: '12-hour cancellation notice. Emergency institute research takes priority.',
      depositRequired: 'Covered under Inter-Institutional MoA.',
      allowedUsage: ['Inorganic semiconductors', 'Carbon nanomaterials', 'Biological fixed samples with cryo-prep']
    },
    eligibilityRequirements: {
      affiliationRequired: ['IISc / IIT / CSIR Researcher', 'Postdoctoral Fellow', 'DST / SERB Grantee'],
      safetyCertifications: ['CeNSE Electron Beam Radiation Safety', 'High-Vacuum Protocol'],
      minimumUserLevel: 'Certified Operator or accompanied by Core Lab Staff'
    },
    operatorAssistance: true,
    certificationRequired: true,
    featured: true
  },
  {
    id: 'res-nmr-600',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'Bruker Avance III HD 600 MHz Biomolecular NMR Spectrometer',
    code: 'LAB-NMR-01',
    category: 'laboratory-equipment',
    categoryLabel: 'Laboratory Equipment',
    description: 'High-field multinuclear magnetic resonance system with 5mm helium-cooled QCI CryoProbe for biological macromolecule structure determination.',
    longDescription: 'Ideal for 1H, 13C, 15N, and 31P correlation experiments, protein-ligand binding kinetics, and natural product elucidation. Includes SampleJet 96-tube automatic autosampler and variable temperature control (-40°C to +120°C).',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'NCBS / TIFR Bangalore',
      department: 'Structural Biology Shared Core',
      campus: 'NCBS / TIFR (GKVK, Bengaluru)',
      verified: true,
      rating: 4.96,
      totalShares: 135
    },
    location: {
      building: 'Eastern Laboratory Complex',
      campus: 'NCBS / TIFR (GKVK, Bengaluru)',
      city: 'Bengaluru',
      room: 'NMR Vault 04'
    },
    pricing: {
      hourlyRate: 1500,
      dailyRate: 9800,
      currency: '₹',
      billingType: 'hourly',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Magnetic Field', value: '14.1 Tesla (600 MHz 1H)' },
      { label: 'Probe Configuration', value: '5mm QCI CryoProbe' },
      { label: 'Automation', value: 'SampleJet 96 carousel' },
      { label: 'Thermal Range', value: '-40 °C to +130 °C' }
    ],
    availability: {
      status: 'in-use',
      nextAvailableSlot: 'Friday at 08:00 IST',
      leadTimeDays: 3,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'certified',
    conditionLabel: 'NABL Calibrated / Certified',
    approvalRequirement: 'dept-signoff',
    approvalLabel: 'Department Head Sign-off',
    usageConditions: {
      cancellationPolicy: 'Cancellations within 24 hours incur 1-hour minimum charge.',
      allowedUsage: ['Standard 5mm NMR tubes', 'No ferromagnetic materials allowed in 5-gauss line']
    },
    eligibilityRequirements: {
      affiliationRequired: ['Chemistry or Biophysics Dept Member', 'Verified Consortium Partner'],
      safetyCertifications: ['High Magnetic Field Safety (5 Gauss perimeter)'],
      minimumUserLevel: 'Trained NMR User Level 3'
    },
    operatorAssistance: true,
    certificationRequired: true,
    featured: false
  },
  {
    id: 'res-eppendorf-pcr',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'Eppendorf Mastercycler X50 Real-Time PCR & Thermocycler Station',
    code: 'LAB-PCR-05',
    category: 'laboratory-equipment',
    categoryLabel: 'Laboratory Equipment',
    description: 'High-speed gradient thermal cycler with dual 96-well independent blocks delivering heating rates of up to 10°C/s for genomics.',
    longDescription: 'Features intuitive touchscreen interface with 2D-gradient technology for simultaneous annealing and denaturation temperature optimization. Includes verified optical validation kit.',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'AIIMS New Delhi',
      department: 'Department of Biotechnology & Genetic Medicine',
      campus: 'AIIMS (Ansari Nagar, New Delhi)',
      verified: true,
      rating: 4.93,
      totalShares: 180
    },
    location: {
      building: 'Convergence Block, 5th Floor',
      campus: 'AIIMS (Ansari Nagar, New Delhi)',
      city: 'New Delhi',
      room: 'Genomics Lab 502'
    },
    pricing: {
      hourlyRate: 400,
      dailyRate: 2400,
      currency: '₹',
      billingType: 'hourly',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Thermal Ramp Rate', value: 'Up to 10 °C/s' },
      { label: 'Block Format', value: 'Dual 96-well silver block' },
      { label: 'Temperature Range', value: '4 °C to 99 °C' },
      { label: 'Gradient Range', value: '0.1 °C to 30 °C' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Today at 15:30 IST',
      leadTimeDays: 0,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'excellent',
    conditionLabel: 'Excellent',
    approvalRequirement: 'instant',
    approvalLabel: 'Instant Booking',
    usageConditions: {
      cancellationPolicy: 'Instant booking with no penalty up to 2 hours prior.',
      allowedUsage: ['Standard molecular biology amplification', 'Non-BSL-3 bioassays']
    },
    eligibilityRequirements: {
      affiliationRequired: ['Biological Sciences Researcher', 'Medical Resident / Fellow'],
      safetyCertifications: ['BSL-1/2 Laboratory Safety'],
      minimumUserLevel: 'Basic Pipetting & Molecular Assay Competency'
    },
    operatorAssistance: false,
    certificationRequired: false,
    featured: false
  },

  // 3. Projectors and Presentation Equipment
  {
    id: 'res-christie-4k30',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'Christie Boxer 4K30 30,000-Lumen 3DLP Large-Venue Projector',
    code: 'PRES-PRJ-01',
    category: 'presentation-projectors',
    categoryLabel: 'Projectors & Presentation',
    description: 'Ultra-bright 30,000 lumen native 4K 3DLP laser phosphor projector designed for large convocation halls, international conferences, and technical symposiums.',
    longDescription: 'Equipped with Christie TruLife processing for 120Hz native 4K rendering. Includes a full set of motorized optical zoom lenses (0.72:1 to 3.8:1) and dual 12G-SDI / DisplayPort inputs with built-in geometric warping.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'IIT Delhi',
      department: 'Central Audio-Visual Core',
      campus: 'IIT Delhi (Hauz Khas, New Delhi)',
      verified: true,
      rating: 4.89,
      totalShares: 65
    },
    location: {
      building: 'Dogra Hall Tech Booth',
      campus: 'IIT Delhi (Hauz Khas, New Delhi)',
      city: 'New Delhi',
      room: 'AV Control Room'
    },
    pricing: {
      hourlyRate: 900,
      dailyRate: 5500,
      currency: '₹',
      billingType: 'daily',
      subsidizedForAcademia: false
    },
    specifications: [
      { label: 'Brightness', value: '30,000 Center Lumens' },
      { label: 'Native Resolution', value: '4K (4096 x 2160)' },
      { label: 'Illumination', value: 'Mercury Xenon & Laser Phosphor' },
      { label: 'Video Inputs', value: '12G-SDI, HDMI 2.0, HDBaseT' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Tomorrow at 11:00 IST',
      leadTimeDays: 1,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'excellent',
    conditionLabel: 'Excellent',
    approvalRequirement: 'host-approval',
    approvalLabel: 'Host Approval Required',
    usageConditions: {
      cancellationPolicy: '48-hour cancellation policy.',
      depositRequired: '₹3,000 security deposit for external event rigs.',
      allowedUsage: ['Academic symposia', 'IEEE / ACM conferences', 'Grand hall lectures']
    },
    eligibilityRequirements: {
      affiliationRequired: ['Department AV Coordinator', 'Registered Event Organizer'],
      safetyCertifications: ['High-Power Lamp Rigging Safety'],
      minimumUserLevel: 'Trained AV Technician'
    },
    operatorAssistance: true,
    certificationRequired: false,
    featured: false
  },
  {
    id: 'res-barco-polycom',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'Barco ClickShare Conference CX-50 & Poly Studio Large Auditorium Rig',
    code: 'PRES-SYS-02',
    category: 'presentation-projectors',
    categoryLabel: 'Projectors & Presentation',
    description: 'Wireless presentation and triple-camera hybrid conferencing system with automatic speaker framing, 4K video pass-through, and Dante audio bridge.',
    longDescription: 'Plug-and-play conference hub allowing seamless multi-participant content sharing from any laptop. Includes 2 ClickShare USB-C buttons, dual HDMI outputs, and network isolation.',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'BITS Pilani',
      department: 'Academic Computing & Telemedia Centre',
      campus: 'BITS Pilani (K.K. Birla Goa Campus)',
      verified: true,
      rating: 4.94,
      totalShares: 88
    },
    location: {
      building: 'Auditorium Complex, Level 2',
      campus: 'BITS Pilani (K.K. Birla Goa Campus)',
      city: 'Goa',
      room: 'Executive Seminar Suite'
    },
    pricing: {
      hourlyRate: 500,
      dailyRate: 3200,
      currency: '₹',
      billingType: 'hourly',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Wireless Range', value: '30 meters (100 ft)' },
      { label: 'Video Output', value: 'Dual 4K UHD @ 60Hz' },
      { label: 'Audio Protocol', value: 'Dante / USB Audio Class 2.0' },
      { label: 'Security', value: 'WPA2-Enterprise, ISO 27001' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Today at 13:00 IST',
      leadTimeDays: 0,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'new',
    conditionLabel: 'Like New / Mint',
    approvalRequirement: 'instant',
    approvalLabel: 'Instant Booking',
    usageConditions: {
      cancellationPolicy: 'Cancel anytime up to 2 hours before booking.',
      allowedUsage: ['Hybrid committee meetings', 'PhD defense live streaming', 'International research workshops']
    },
    eligibilityRequirements: {
      affiliationRequired: ['University Staff', 'Graduate Students', 'Faculty'],
      safetyCertifications: ['None required'],
      minimumUserLevel: 'General user'
    },
    operatorAssistance: false,
    certificationRequired: false,
    featured: false
  },

  // 4. Cameras and Microphones
  {
    id: 'res-sony-fx9-kit',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'Sony FX9 6K Full-Frame Cinema Camera Kit with G Master Prime Set',
    code: 'MEDIA-CAM-01',
    category: 'cameras-microphones',
    categoryLabel: 'Cameras & Microphones',
    description: 'Full-frame 6K back-illuminated Exmor R CMOS camera kit equipped with fast hybrid autofocus, dual base ISO (800/4000), and 16-bit raw output.',
    longDescription: 'Includes Sony FE 24mm, 50mm, and 85mm F1.4 GM prime lenses, Chrosziel follow focus, Tilta V-mount power distribution cage, dual 240GB XQD cards, and Miller fluid-head carbon tripod.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'NID Ahmedabad',
      department: 'Film and Video Communication Resource Hub',
      campus: 'NID (Paldi, Ahmedabad)',
      verified: true,
      rating: 4.96,
      totalShares: 154
    },
    location: {
      building: 'Design Studios Block C',
      campus: 'NID (Paldi, Ahmedabad)',
      city: 'Ahmedabad',
      room: 'Cinematography Vault 1'
    },
    pricing: {
      hourlyRate: 750,
      dailyRate: 4200,
      currency: '₹',
      billingType: 'daily',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Sensor', value: 'Full-Frame 6K Exmor R CMOS' },
      { label: 'Dynamic Range', value: '15+ Stops with S-Log3' },
      { label: 'Recording Formats', value: 'XAVC-I 4K 10-bit 4:2:2' },
      { label: 'Lens Mount', value: 'Sony E-mount (locking)' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Tomorrow at 09:00 IST',
      leadTimeDays: 1,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'excellent',
    conditionLabel: 'Excellent',
    approvalRequirement: 'host-approval',
    approvalLabel: 'Host Approval Required',
    usageConditions: {
      cancellationPolicy: '24-hour advance cancellation.',
      depositRequired: '₹2,000 equipment checkout caution deposit.',
      allowedUsage: ['Scientific documentation', 'Institutional documentary', 'Design research projects']
    },
    eligibilityRequirements: {
      affiliationRequired: ['Design / Media Student', 'Research PI / Lab Lead'],
      safetyCertifications: ['Camera Rigging & Sensor Cleaning Protocol'],
      minimumUserLevel: 'Intermediate camera operator'
    },
    operatorAssistance: false,
    certificationRequired: true,
    featured: true
  },
  {
    id: 'res-sennheiser-ewdx',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'Sennheiser EW-DX Wireless Multi-Channel Dual Lavalier & Boom Kit',
    code: 'MEDIA-MIC-02',
    category: 'cameras-microphones',
    categoryLabel: 'Cameras & Microphones',
    description: 'Digital UHF wireless microphone system with 134 dB input dynamic range, zero intermodulation artifacts, and 1.9 ms ultra-low latency transmission.',
    longDescription: 'Complete kit includes dual bodypack transmitters, MKE 2 gold omnidirectional lavaliers, MKH 416 directional shotgun boom, Sound Devices MixPre-6 II audio recorder, and Pelican flight case.',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'NID Ahmedabad',
      department: 'Audio Design Lab',
      campus: 'NID (Paldi, Ahmedabad)',
      verified: true,
      rating: 4.91,
      totalShares: 78
    },
    location: {
      building: 'Design Studios Block C',
      campus: 'NID (Paldi, Ahmedabad)',
      city: 'Ahmedabad',
      room: 'Sound Recording Studio'
    },
    pricing: {
      hourlyRate: 300,
      dailyRate: 1800,
      currency: '₹',
      billingType: 'daily',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Transmission', value: 'Digital UHF (88 MHz switching)' },
      { label: 'Dynamic Range', value: '134 dB input range' },
      { label: 'Audio Latency', value: '1.9 ms' },
      { label: 'Battery Runtime', value: '12 hours on Li-ion pack' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Today at 16:00 IST',
      leadTimeDays: 0,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'new',
    conditionLabel: 'Like New / Mint',
    approvalRequirement: 'instant',
    approvalLabel: 'Instant Booking',
    usageConditions: {
      cancellationPolicy: 'Free cancellation up to 4 hours before pickup.',
      allowedUsage: ['Podcast production', 'Broadcast interviews', 'Field acoustic recording']
    },
    eligibilityRequirements: {
      affiliationRequired: ['College Affiliate', 'Student Media Guild Member'],
      safetyCertifications: ['Basic Audio Equipment Handling'],
      minimumUserLevel: 'Basic audio proficiency'
    },
    operatorAssistance: false,
    certificationRequired: false,
    featured: false
  },

  // 5. Arduino and IoT Kits
  {
    id: 'res-arduino-portenta-kit',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'Arduino Pro Portenta Machine Control & Edge AI Development Lab Kit (10x Units)',
    code: 'IOT-ARD-01',
    category: 'arduino-iot-kits',
    categoryLabel: 'Arduino & IoT Kits',
    description: 'Fleet of 10 industrial-grade Arduino Portenta Machine Control units with dual-core STM32H7 processors for IoT automation, Edge AI inference, and predictive maintenance.',
    longDescription: 'Each unit features 8 digital inputs, 8 digital outputs, isolated RS-485, CAN bus, Ethernet, Wi-Fi/Bluetooth, and programmable relay channels. Comes with sensor modules, thermocouple interfaces, and breakout DIN rail enclosures.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'IIT Bombay',
      department: 'Wadhwani Electronics Lab & Tinkering Shed',
      campus: 'IIT Bombay (Powai, Mumbai)',
      verified: true,
      rating: 4.92,
      totalShares: 195
    },
    location: {
      building: 'Tinkering Lab, Ground Floor',
      campus: 'IIT Bombay (Powai, Mumbai)',
      city: 'Mumbai',
      room: 'Embedded IoT Section'
    },
    pricing: {
      hourlyRate: 150,
      dailyRate: 900,
      currency: '₹',
      billingType: 'daily',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Processor', value: 'Dual-core STM32H747XI (Cortex-M7 @ 480MHz + M4 @ 240MHz)' },
      { label: 'Operating Voltage', value: '24V DC industrial power supply' },
      { label: 'Protocols', value: 'CAN, RS-485, Modbus, MQTT, BLE 5.0' },
      { label: 'Edge AI Support', value: 'TensorFlow Lite for Microcontrollers' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Today at 11:00 IST',
      leadTimeDays: 0,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'new',
    conditionLabel: 'Like New / Mint',
    approvalRequirement: 'instant',
    approvalLabel: 'Instant Booking',
    usageConditions: {
      cancellationPolicy: 'Free cancellation up to 2 hours prior.',
      allowedUsage: ['Embedded software engineering', 'Smart agriculture research', 'Industrial automation capstones']
    },
    eligibilityRequirements: {
      affiliationRequired: ['Engineering Faculty / Student', 'Robotics Club Member'],
      safetyCertifications: ['Basic Electronics ESD Precaution Guidelines'],
      minimumUserLevel: 'Basic C++/Arduino or MicroPython experience'
    },
    operatorAssistance: false,
    certificationRequired: false,
    featured: true
  },
  {
    id: 'res-lorawan-fleet',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'SparkFun LoRaWAN & ESP32 Sensor Grid Deployment Prototyping Fleet',
    code: 'IOT-LORA-04',
    category: 'arduino-iot-kits',
    categoryLabel: 'Arduino & IoT Kits',
    description: 'Field-ready environmental IoT mesh telemetry kit featuring 8 solar-backed ESP32 LoRaWAN nodes, The Things Network 8-channel gateway, and sensor payload array.',
    longDescription: 'Designed for outdoor field deployment across campuses or micro-climates. Includes BME680 atmospheric sensors, particulate matter PMS5003 sensors, waterproof enclosures, and long-range directional antennas.',
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'IIT Delhi',
      department: 'Bharti School of Telecommunication Technology',
      campus: 'IIT Delhi (Hauz Khas, New Delhi)',
      verified: true,
      rating: 4.88,
      totalShares: 62
    },
    location: {
      building: 'Bharti Building',
      campus: 'IIT Delhi (Hauz Khas, New Delhi)',
      city: 'New Delhi',
      room: 'Wireless Lab 3'
    },
    pricing: {
      hourlyRate: 200,
      dailyRate: 1200,
      currency: '₹',
      billingType: 'daily',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Frequency Band', value: 'IN865 MHz LoRa' },
      { label: 'Line of Sight Range', value: 'Up to 15 km with 3dBi antenna' },
      { label: 'Node Count', value: '8 weather-sealed nodes + 1 indoor gateway' },
      { label: 'Telemetry Cloud', value: 'Pre-configured TTN / MQTT pipeline' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Tomorrow at 13:00 IST',
      leadTimeDays: 1,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'excellent',
    conditionLabel: 'Excellent',
    approvalRequirement: 'instant',
    approvalLabel: 'Instant Booking',
    usageConditions: {
      cancellationPolicy: '24-hour advance notice for fleet checkout.',
      allowedUsage: ['Microclimate modeling', 'Campus air quality sensing', 'Mesh networking research']
    },
    eligibilityRequirements: {
      affiliationRequired: ['Verified Campus Researcher', 'Smart City Initiative Member'],
      safetyCertifications: ['None required'],
      minimumUserLevel: 'Basic sensor networking fundamentals'
    },
    operatorAssistance: false,
    certificationRequired: false,
    featured: false
  },

  // 6. CNC Machines and Fabrication Tools
  {
    id: 'res-haas-5axis',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'Haas UMC-750 5-Axis Universal Machining Center',
    code: 'FAB-CNC-04',
    category: 'cnc-fabrication',
    categoryLabel: 'CNC & Fabrication Tools',
    description: 'High-speed 5-axis vertical machining center designed for complex aerospace prototypes, medical alloy titanium machining, and precision molds.',
    longDescription: 'Integrated dual-axis trunnion table with 12,000 RPM 40-taper inline direct-drive spindle. Includes Renishaw wireless tool and part probing suite, high-pressure through-spindle coolant (1000 psi), and 40+1 tool carousel.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'IIT Madras',
      department: 'Centre for Innovation (CFI) & Central Machining Facility',
      campus: 'IIT Madras (Guindy, Chennai)',
      verified: true,
      rating: 4.93,
      totalShares: 125
    },
    location: {
      building: 'Central Workshop Complex',
      campus: 'IIT Madras (Guindy, Chennai)',
      city: 'Chennai',
      room: 'Heavy CNC Bay 2'
    },
    pricing: {
      hourlyRate: 850,
      dailyRate: 5800,
      currency: '₹',
      billingType: 'hourly',
      subsidizedForAcademia: false
    },
    specifications: [
      { label: 'Travels (X, Y, Z)', value: '762 x 508 x 508 mm' },
      { label: 'Spindle Power', value: '30 hp (22.4 kW)' },
      { label: 'Max Table Load', value: '300 kg' },
      { label: 'Probing', value: 'Renishaw Wireless WIPS' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Thursday at 13:00 IST',
      leadTimeDays: 2,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'certified',
    conditionLabel: 'NABL Calibrated / Certified',
    approvalRequirement: 'dept-signoff',
    approvalLabel: 'Department Head Sign-off',
    usageConditions: {
      cancellationPolicy: '48-hour cancellation policy. Tool breakage charges apply if operated without machinist supervision.',
      depositRequired: '₹2,500 consumable and tooling bond for commercial runs.',
      allowedUsage: ['Aluminum 6061/7075', 'Stainless 316', 'Titanium Grade 5 (with prior approval)']
    },
    eligibilityRequirements: {
      affiliationRequired: ['Mechanical Engineering Dept Member', 'Certified Machinist Guild'],
      safetyCertifications: ['Machine Shop Safety Level 3 (5-Axis Mastercam Cert)'],
      minimumUserLevel: 'Journeyman Machinist or supervised by Staff Technician'
    },
    operatorAssistance: true,
    certificationRequired: true,
    featured: true
  },
  {
    id: 'res-formlabs-form4l',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'Formlabs Form 4L SLA Industrial 3D Rapid Prototyping Workstation',
    code: 'FAB-SLA-02',
    category: 'cnc-fabrication',
    categoryLabel: 'CNC & Fabrication Tools',
    description: 'Large-format Low Force Display (LFD) SLA printer capable of producing human-scale engineering prototypes in tough, rigid, and medical biocompatible resins.',
    longDescription: 'Features 353 x 196 x 350 mm build volume with ultra-fast layer cure times down to 1.5 seconds. Bundled with automated Form Wash L solvent bath and Form Cure L ultraviolet curing chamber.',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'IIT Bombay',
      department: 'Society for Innovation and Development (SINE) Prototyping Cell',
      campus: 'IIT Bombay (Powai, Mumbai)',
      verified: true,
      rating: 4.95,
      totalShares: 235
    },
    location: {
      building: 'SINE Innovation Centre, 1st Floor',
      campus: 'IIT Bombay (Powai, Mumbai)',
      city: 'Mumbai',
      room: 'Rapid Fab Bay'
    },
    pricing: {
      hourlyRate: 450,
      dailyRate: 2800,
      currency: '₹',
      billingType: 'hourly',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Build Envelope', value: '353 x 196 x 350 mm' },
      { label: 'XY Resolution', value: '46 microns' },
      { label: 'Layer Thickness', value: '25 to 200 microns' },
      { label: 'Supported Resins', value: 'Tough 2000, Rigid 10K, BioMed Clear' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Today at 17:00 IST',
      leadTimeDays: 0,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'new',
    conditionLabel: 'Like New / Mint',
    approvalRequirement: 'instant',
    approvalLabel: 'Instant Booking',
    usageConditions: {
      cancellationPolicy: 'Free cancellation up to 4 hours prior.',
      allowedUsage: ['Medical prosthetic prototypes', 'Fluidic manifolds', 'Enclosures']
    },
    eligibilityRequirements: {
      affiliationRequired: ['University Student / Faculty', 'Resident Incubator Member'],
      safetyCertifications: ['Photopolymer Resin Chemical Safety'],
      minimumUserLevel: 'Basic SLA CAD slicing competency'
    },
    operatorAssistance: false,
    certificationRequired: false,
    featured: false
  },

  // 7. Research Spaces and Meeting Rooms
  {
    id: 'res-iso5-cleanroom',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'ISO Class 5 (Fed Std 209E Class 100) Photolithography Bay',
    code: 'SP-CLN-02',
    category: 'spaces-meeting-rooms',
    categoryLabel: 'Research Spaces & Rooms',
    description: 'Vibration-isolated cleanroom facility dedicated to mask aligner photolithography, wet chemical bench etching, and optical profilometry inspection.',
    longDescription: 'Equipped with Suss MicroTec MA6 contact aligner (sub-micron resolution), Laurell spin coater, convection soft/hard bake ovens, and ultra-pure deionized water loop (>18.2 MOhm-cm). Strictly regulated HVAC humidity and temperature.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'IISc Bangalore',
      department: 'National Nanofabrication Centre (NNfC)',
      campus: 'IISc Bangalore (Malleshwaram, Bengaluru)',
      verified: true,
      rating: 4.99,
      totalShares: 320
    },
    location: {
      building: 'CeNSE Complex, Cleanroom Wing',
      campus: 'IISc Bangalore (Malleshwaram, Bengaluru)',
      city: 'Bengaluru',
      room: 'Bay 4 Photolith'
    },
    pricing: {
      hourlyRate: 1600,
      dailyRate: 11000,
      currency: '₹',
      billingType: 'hourly',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Cleanliness Rating', value: 'ISO 14644-1 Class 5' },
      { label: 'Aligner Resolution', value: '0.8 µm contact mode' },
      { label: 'Substrate Sizes', value: 'Pieces to 150mm wafers' },
      { label: 'Air Flow Rate', value: 'HEPA laminar 90 FPM' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Today at 16:30 IST',
      leadTimeDays: 0,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'certified',
    conditionLabel: 'NABL Calibrated / Certified',
    approvalRequirement: 'dept-signoff',
    approvalLabel: 'Department Head Sign-off',
    usageConditions: {
      cancellationPolicy: '24-hour advance cancellation.',
      depositRequired: '₹2,000 gowning and cleanroom laundry overhead.',
      allowedUsage: ['Microfluidic masters', 'MEMS sensors', 'Silicon photonics chips']
    },
    eligibilityRequirements: {
      affiliationRequired: ['Verified Nanocenter User', 'Department PI Endorsement'],
      safetyCertifications: ['Cleanroom Protocol & Chemical Hygiene Certification'],
      minimumUserLevel: 'Approved Cleanroom Operator'
    },
    operatorAssistance: false,
    certificationRequired: true,
    featured: true
  },
  {
    id: 'res-turing-theater',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'Ramanujan Collaborative Research Theater & Hybrid Seminar Suite',
    code: 'SP-SEM-08',
    category: 'spaces-meeting-rooms',
    categoryLabel: 'Research Spaces & Rooms',
    description: 'Tiered 80-seat scientific presentation hall and collaborative working space with wireless screen mirroring, dual tracking 4K PTZ cameras, and acoustic ceiling baffles.',
    longDescription: 'Equipped with Shure microflex ceiling array microphones for natural room pickup without handheld mics. Features electronic whiteboards, breakout pod monitors, and isolated NKN gigabit Wi-Fi for international symposiums.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'IIT Bombay',
      department: 'Victor Menezes Convention Centre (VMCC)',
      campus: 'IIT Bombay (Powai, Mumbai)',
      verified: true,
      rating: 4.94,
      totalShares: 160
    },
    location: {
      building: 'VMCC Complex, Floor 2',
      campus: 'IIT Bombay (Powai, Mumbai)',
      city: 'Mumbai',
      room: 'Hall 201'
    },
    pricing: {
      hourlyRate: 650,
      dailyRate: 4500,
      currency: '₹',
      billingType: 'hourly',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Capacity', value: '80 Tiered Ergonomic Seats' },
      { label: 'Display System', value: 'Triple 98" 4K Commercial Displays' },
      { label: 'Audio Rig', value: 'Shure Microflex Ceiling Array + Biamp DSP' },
      { label: 'Connectivity', value: '10 Gbps National Knowledge Network (NKN)' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Tomorrow at 14:00 IST',
      leadTimeDays: 1,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'excellent',
    conditionLabel: 'Excellent',
    approvalRequirement: 'instant',
    approvalLabel: 'Instant Booking',
    usageConditions: {
      cancellationPolicy: '12-hour cancellation notice.',
      allowedUsage: ['Research colloquia', 'Grant defense presentations', 'Consortium workshops']
    },
    eligibilityRequirements: {
      affiliationRequired: ['University Faculty', 'Postdoctoral Society', 'Recognized Academic Group'],
      safetyCertifications: ['Building Security Briefing'],
      minimumUserLevel: 'General faculty / staff'
    },
    operatorAssistance: false,
    certificationRequired: false,
    featured: false
  },

  // 8. Computers and Specialised Hardware
  {
    id: 'res-dgx-h100',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'NVIDIA DGX H100 Liquid-Cooled AI Compute Node (8x 80GB SXM5)',
    code: 'COMP-GPU-09',
    category: 'computers-hardware',
    categoryLabel: 'Computers & Specialised HW',
    description: 'Dedicated high-density computing node with 3.2 Tbps InfiniBand interconnect for fine-tuning Indic LLMs, foundation models, and molecular dynamics simulations.',
    longDescription: 'Features 8x NVIDIA H100 Tensor Core GPUs with 640GB aggregate high-bandwidth VRAM (HBM3), 2TB system DDR5 memory, dual 4th-Gen Intel Xeon Platinum 8480C processors, and 30TB NVMe scratch storage mounted on ultra-fast Lustre filesystem.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'IISc Bangalore',
      department: 'Supercomputer Education and Research Centre (SERC)',
      campus: 'IISc Bangalore (Malleshwaram, Bengaluru)',
      verified: true,
      rating: 4.98,
      totalShares: 410
    },
    location: {
      building: 'Param Pravega Supercomputing Facility',
      campus: 'IISc Bangalore (Malleshwaram, Bengaluru)',
      city: 'Bengaluru',
      room: 'Server Bay Row 8'
    },
    pricing: {
      hourlyRate: 800,
      dailyRate: 15000,
      currency: '₹',
      billingType: 'hourly',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'GPU Count', value: '8x NVIDIA H100 SXM5 80GB' },
      { label: 'AI Performance', value: '32 PetaFLOPS FP8' },
      { label: 'Interconnect', value: 'NVIDIA NVLink 900 GB/s' },
      { label: 'Networking', value: '8x 400Gb/s OSFP InfiniBand' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Available Immediately (SLURM Queue)',
      leadTimeDays: 0,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'new',
    conditionLabel: 'Like New / Mint',
    approvalRequirement: 'instant',
    approvalLabel: 'Instant Booking',
    usageConditions: {
      cancellationPolicy: 'Hourly compute billing stops instantly upon job termination.',
      allowedUsage: ['Indic LLM pretraining & RLHF', 'Cryo-EM 3D reconstruction', 'Computational fluid dynamics']
    },
    eligibilityRequirements: {
      affiliationRequired: ['National Supercomputing Mission (NSM) Grantee', 'Registered AI Lab Researcher'],
      safetyCertifications: ['SERC Cluster User Agreement & Data Privacy Sign-off'],
      minimumUserLevel: 'SLURM / Docker / PyTorch proficiency'
    },
    operatorAssistance: false,
    certificationRequired: false,
    featured: true
  },
  {
    id: 'res-mac-studio-ultra',
    ownerId: 'usr-owner-01',
    active: true,
    title: 'Apple Mac Studio M2 Ultra (192GB Unified Memory) Color & Simulation Rig',
    code: 'COMP-WS-02',
    category: 'computers-hardware',
    categoryLabel: 'Computers & Specialised HW',
    description: 'High-end workstation powered by Apple M2 Ultra (24-core CPU, 76-core GPU, 32-core Neural Engine) with 192GB unified RAM and 8TB internal storage.',
    longDescription: 'Ideal for local 70B parameter LLM inference, 8K RED RAW grading, and complex protein folding visualizations. Bundled with Apple Pro Display XDR (retina 6K reference monitor) and CalDigit Thunderbolt 4 dock.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80'
    ],
    institution: {
      name: 'NID Ahmedabad',
      department: 'Digital Design & Animation Lab',
      campus: 'NID (Paldi, Ahmedabad)',
      verified: true,
      rating: 4.95,
      totalShares: 198
    },
    location: {
      building: 'Visual Design Complex',
      campus: 'NID (Paldi, Ahmedabad)',
      city: 'Ahmedabad',
      room: 'Edit Studio 4'
    },
    pricing: {
      hourlyRate: 350,
      dailyRate: 2200,
      currency: '₹',
      billingType: 'hourly',
      subsidizedForAcademia: true
    },
    specifications: [
      { label: 'Chip', value: 'Apple M2 Ultra (24 CPU / 76 GPU / 32 NPU)' },
      { label: 'Memory', value: '192GB Unified Memory (800GB/s bandwidth)' },
      { label: 'Internal SSD', value: '8TB NVMe (7.4 GB/s read)' },
      { label: 'Reference Display', value: '32" Retina 6K Apple Pro Display XDR' }
    ],
    availability: {
      status: 'available',
      nextAvailableSlot: 'Today at 13:30 IST',
      leadTimeDays: 0,
      schedule: DEFAULT_SCHEDULE
    },
    condition: 'excellent',
    conditionLabel: 'Excellent',
    approvalRequirement: 'instant',
    approvalLabel: 'Instant Booking',
    usageConditions: {
      cancellationPolicy: 'Free cancellation up to 1 hour before scheduled time.',
      allowedUsage: ['Scientific data rendering', 'DaVinci Resolve color grading', 'Local AI model benchmarking']
    },
    eligibilityRequirements: {
      affiliationRequired: ['Design / CS Student', 'Research Faculty'],
      safetyCertifications: ['Digital Lab Clean Desk Policy'],
      minimumUserLevel: 'Standard workstation user'
    },
    operatorAssistance: false,
    certificationRequired: false,
    featured: false
  }
];

export const INSTITUTIONS_LIST = [
  'All Institutions',
  'IIT Bombay',
  'IISc Bangalore',
  'IIT Madras',
  'IIT Delhi',
  'BITS Pilani',
  'NCBS / TIFR Bangalore',
  'AIIMS New Delhi',
  'NID Ahmedabad'
];

export const CITIES_LIST = [
  'All Locations',
  'Mumbai',
  'Bengaluru',
  'Chennai',
  'New Delhi',
  'Goa',
  'Ahmedabad'
];
