const accountMockData = {
  'Account ID': 'xxxx',
  '10 digit Account ID': 'xxxxxx',
  'Account Name': 'xxxx',
  'IC Number': 'xxxxx',
  'IC Type': 'xxxxxxxxxx',
  'VIP Status': 'xxxxx',
  'Customer Type': 'xxxx',
  'Bill Frequency': 'xxxx',
  'Payment Type': 'xxx',
  'Last CC/DD Extraction': 'xxx',
  'AR Balance': 'xxxxx',
  'Account Status': 'xxxx',
  'Bill Cycle Code': 'xxxx',
  'New Bill Cycle Code': 'xxx',
  'Old Bill Cycle Exp Date': 'xxxx'
};

const accountWinleadMockData = {
  'Account No': 'xxxx',
  NRIC: 'xxxx',
  Mobile: 'xxxx',
  Home: 'xxxx',
  Office: 'xxxx',
  Email: 'xxxx',
  Subtype: 'xxxx',
  Type: 'xxxx',
  Race: 'xxxx',
  BillCycle: 'xxxx',
  BillFreq: 'xxxx',
  PTPViolated: 'xxxx',
  PayMethod: 'xxxx',
  CCInfo: 'xxxx'
};

const contactMockData = {
  contact_name: 'xxxx',
  account_name: 'xxxxx',
  primary_phone: 'xxx',
  office_phone: 'xxxxxxxxxx',
  mobile_phone: 'xxxxxxxxxx',
  home_phone: 'xxxxxxxxxx',
  fax: 'xxxxxxx',
  email: 'xxxxxxx@mail.com',
  race: 'xxxxx',
  dob: 'xxx',
  nationality: 'xxxxxx',
  vip_status: 'xx'
};

const priceCalculatorInfo = [
  {
    title: 'STARTER PACK',
    plan: {
      cid: '1483526',
      offer_name: 'PRIMARY PACK'
    },
    cust_comm_msg: {
      en: '',
      ml: '',
      zh: ''
    },
    priority: '1'
  }
];
const priceCalculatorCatalogInfo = {
  id: '2204420757',
  parentProductRef: {},
  customerRef: {
    id: '114721897'
  },
  status: 'Active',
  offering: {
    id: '39826',
    name: 'Family IPTV',
    productSpecification: {
      id: '38346',
      type: 'productSpec'
    },
    type: 'DTH',
    packages: [
      {
        description:
          'This Grouping Component contains Family Package, Chinese Family, Family HD, Chinese Family HD',
        name: 'Basic Packages',
        subPackages: [
          {
            id: '661',
            name: 'Family'
          },
          {
            id: '465823',
            name: 'Family Extra'
          }
        ]
      },
      {
        description: 'List of Mini Packages available for Subscription.',
        name: 'Mini Packages',
        subPackages: [
          {
            id: '231',
            name: 'Kids'
          },
          {
            id: '721',
            name: 'Learning'
          },
          {
            id: '751',
            name: 'News'
          }
        ]
      },
      {
        description: 'Astro Cloud',
        name: 'Astro Cloud',
        subPackages: []
      },
      {
        description: 'This component groups all the Prime Packages.',
        name: 'Prime Packages',
        subPackages: [
          {
            id: '691',
            name: 'Movie'
          }
        ]
      },
      {
        description: 'This component groups all the A-La-Carte channels',
        name: 'A-La-Carte Channels',
        subPackages: [
          {
            id: '272271',
            name: 'RTV'
          },
          {
            id: '152716',
            name: 'BollyOne HD'
          }
        ]
      },
      {
        description: 'HD Services',
        name: 'HD Services',
        subPackages: []
      },
      {
        name: 'PPV',
        subPackages: []
      }
    ],
    broadbandServiceInfo: {
      speed: '13',
      speedName: '10Mbps',
      serviceProvider: 'TIME',
      isUpgradable: false
    },
    installationOptions: {
      InstallationCategory: 'AstroInstall',
      viewingOption: 'UNICAST'
    },
    price: [
      {
        type: 'oneTime',
        amount: {
          currencyCode: 'MYR',
          value: 0
        }
      },
      {
        type: 'recurring',
        amount: {
          currencyCode: 'MYR',
          value: 129
        }
      }
    ],
    contract: {
      commitment: {
        leftDuration: '12',
        period: {
          endDate: ''
        },
        penaltyAmount: '123'
      }
    },
    extension: {
      isBroadBandDTH: false
    }
  },
  physicalResources: [
    {
      id: 'DTV2DB1810002132',
      type: 'Decoder',
      name: 'HD PVR',
      extension: {
        promotion: {
          id: 'FamilyPack10MbpsTIME'
        },
        campaign: {
          id: 'W11ACRES'
        }
      }
    },
    {
      id: '016009774551',
      type: 'SMC',
      extension: {
        bouquetId: 'IPTV'
      }
    }
  ]
};

const accountInfoByEmail = {
  name: 'John L Ponratnam',
  updated_at: 1606363180000,
  mobile_verified: true,
  email_verified: true,
  email: 'dhayaharan@yahoo.co.in',
  mobile: '60123410698',
  user_contactId: '10305898',
  user_accountNumber: '98843637',
  PUID: '64D4CC1ADCC87A463BA92517931707',
  EPUID: '82Y81V3UV9V8672V6577X118826X1707',
  astro_entitlements: {
    accounts: [
      {
        displayName: 'JOHN LEE DHAYAHARAN SUGUMAR',
        status: 'ACTIVATED',
        accountNumber: '96190717',
        subscriberSubType: 'Normal',
        subscriberType: 'EMPLOYEE',
        subscriptions: [
          {
            status: 'ACTIVATED',
            subscriptionNumber: '016005103649'
          }
        ]
      }
    ]
  }
};

const interactionMockData = [
  {
    'Start Time': '20-Jan-2021 01:35:26 PM',
    'End Time': '20-Jan-2021 01:35:26 PM',
    Title: 'Ordering Outbound Notification',
    Notes: 'Interaction on OutBoundCommunication',
    'Login Name': 'SA',
    'First Name': 'sa',
    'Last Name': 'sa'
  },
  {
    'Start Time': '20-Jan-2021 01:30:55 PM',
    'End Time': '20-Jan-2021 01:30:55 PM',
    Title: 'Order Submission',
    Notes:
      'Order 540431104A Submitted by User DSA0001001 from DL Sales Channel, sales profile code of Dealer is 9Y8.',
    'Login Name': 'DEX_DIRECT_SALES',
    'First Name': 'dex_direct_sales',
    'Last Name': 'dex_direct_sales'
  },
  {
    'Start Time': '20-Jan-2021 01:30:55 PM',
    'End Time': '20-Jan-2021 01:30:55 PM',
    Title: 'Order Submission',
    Notes:
      'Audit Trail created from DEX application to track the user activity; This entry was created to track changes done as part of order submission',
    'Login Name': 'DEX_DIRECT_SALES',
    'First Name': 'dex_direct_sales',
    'Last Name': 'dex_direct_sales'
  }
];

const interactionWinleadMockData = [
  {
    Title: 'xxxx',
    Media: 'xxxx',
    Direction: 'xxxx',
    Text: 'xxxx'
  }
];

const pdpaMockData = {
  contact_name: 'xxxx',
  account_name: 'xxxxx',
  primary_phone: 'xxx',
  office_phone: 'xxxxxxxxxx',
  mobile_phone: 'xxxxxxxxxx',
  home_phone: 'xxxxxxxxxx',
  fax: 'xxxxxxx',
  email: 'xxxxxxx@mail.com',
  race: 'xxxxx',
  dob: 'xxx',
  nationality: 'xxxxxx',
  vip_status: 'xx'
};

const caseHistoryMockData = {
  case_id: 'xxxx',
  account_name: 'xxxxxx',
  ic_type: 'xxxxx',
  ten_digit_acc_id: 'xxxxxxxxxx',
  ic_number: 'xxxxx',
  vip_status: 'xxxx',
  customer_type: 'xxxx',
  bill_frequency: 'xxx',
  payment_type: 'xxx',
  last_cc_dd_extraction: 'xxxxx',
  ar_balance: 'xxxx',
  account_status: 'xxxx',
  bill_cycle_code: 'xxx',
  old_bill_cycle_exp_date: 'xxxx'
};

const caseFulfillmentOrderMockData = {
  case_id: 'xxxx',
  account_name: 'xxxxxx',
  ic_type: 'xxxxx',
  ten_digit_acc_id: 'xxxxxxxxxx',
  ic_number: 'xxxxx',
  vip_status: 'xxxx',
  customer_type: 'xxxx',
  bill_frequency: 'xxx',
  payment_type: 'xxx',
  last_cc_dd_extraction: 'xxxxx',
  ar_balance: 'xxxx',
  account_status: 'xxxx',
  bill_cycle_code: 'xxx',
  old_bill_cycle_exp_date: 'xxxx'
};

const caseFulfillmentDetailsMockData = {
  case_id: 'xxxx',
  account_name: 'xxxxxx',
  ic_type: 'xxxxx',
  ten_digit_acc_id: 'xxxxxxxxxx',
  ic_number: 'xxxxx',
  vip_status: 'xxxx',
  customer_type: 'xxxx',
  bill_frequency: 'xxx',
  payment_type: 'xxx',
  last_cc_dd_extraction: 'xxxxx',
  ar_balance: 'xxxx',
  account_status: 'xxxx',
  bill_cycle_code: 'xxx',
  old_bill_cycle_exp_date: 'xxxx'
};

const caseFlexibleAttributesMockData = {
  account_id: 'xxxx',
  account_name: 'xxxxxx',
  ic_type: 'xxxxx',
  ten_digit_acc_id: 'xxxxxxxxxx',
  ic_number: 'xxxxx',
  vip_status: 'xxxx',
  customer_type: 'xxxx',
  bill_frequency: 'xxx',
  payment_type: 'xxx',
  last_cc_dd_extraction: 'xxxxx',
  ar_balance: 'xxxx',
  account_status: 'xxxx',
  bill_cycle_code: 'xxx',
  old_bill_cycle_exp_date: 'xxxx'
};

const caseDetailsInfoMockData = {
  account_id: 'xxxx',
  account_name: 'xxxxxx',
  ic_type: 'xxxxx',
  ten_digit_acc_id: 'xxxxxxxxxx',
  ic_number: 'xxxxx',
  vip_status: 'xxxx',
  customer_type: 'xxxx',
  bill_frequency: 'xxx',
  payment_type: 'xxx',
  last_cc_dd_extraction: 'xxxxx',
  ar_balance: 'xxxx',
  account_status: 'xxxx',
  bill_cycle_code: 'xxx',
  old_bill_cycle_exp_date: 'xxxx'
};

const caseSubCaseMockData = {
  account_id: 'xxxx',
  account_name: 'xxxxxx',
  ic_type: 'xxxxx',
  ten_digit_acc_id: 'xxxxxxxxxx',
  ic_number: 'xxxxx',
  vip_status: 'xxxx',
  customer_type: 'xxxx',
  bill_frequency: 'xxx',
  payment_type: 'xxx',
  last_cc_dd_extraction: 'xxxxx',
  ar_balance: 'xxxx',
  account_status: 'xxxx',
  bill_cycle_code: 'xxx',
  old_bill_cycle_exp_date: 'xxxx'
};

const auditLogsMockData = {
  resultCode: '01',
  body: {
    userId: 'akshay-admin',
    activity: 'Login',
    description: 'Login:',
    page: 'Login Page',
    timestamp: '2021-03-25T12:28:46.000Z',
    ipAddress: '103.209.88.70',
    hostName: '103'
  }
};

const auditLogsMockDataFailed = {
  resultCode: '05',
  body: 'Error'
};

const alertsMockData = [
  {
    ALERT_MSG: 'Escalate to Elite Team if submission from K0101133',
    PRIORITY: '1',
    ISACTIVE: '0',
    CHECK: '0',
    RAG: 'R',
    ALERT_ID: 1
  },
  {
    ALERT_MSG: 'Escalate to Elite Team if submission from K0101133',
    PRIORITY: '1',
    ISACTIVE: '0',
    CHECK: '0',
    RAG: 'R',
    ALERT_ID: 2
  }
];
const portalAccountMockData = {
  accountNumber: '96190717',
  email: 'dhayaharan@yahoo.co.in',
  mobile: '60123410698',
  puid: '64D4CC1ADCC87A463BA92517931707'
};

const ulmUnlinkingMockData = {
  accountNumber: '96190717',
  puid: '64D4CC1ADCC87A463BA92517931707',
  status: '200'
};

const leadOrderDetailsMockData = {
  orderDetails: {
    offerName: 'Value pack 3b',
    state: 'Ordered',
    status: 'Active',
    initialProvisioningDate: '',
    subscriber: 'Anonymous',
    orderActionReaon: '',
    groupLevel: 'Subscriber',
    updateDate: '',
    installationAddress: '',
    serviceType: 'Subscription Main Component'
  },
  residentialSubscription: {
    isCPVRVisible: 'Yes',
    CardNickname: '',
    IsBroadbandDTH: 'No',
    FirstTimePackageUpgrade: 'No',
    Customer_Override_Activity: '',
    FormSerialNumber: '',
    PromotionEndDate: '',
    IsExistingDbb: 'No',
    Category_Type: 'HD',
    NGVRCoverrideamount: 0,
    PrimaryARPU: '',
    SuspensionLevel: 'NONE',
    IsFulfillmentRequired: '',
    PrimarySubscription: 'Yes',
    RLC_Commitmentperiodinmonths: 6,
    ISIVPSubscription: 'No',
    NGV_RC_Override_Ind: 'Y',
    RetailerName: '',
    InstallerCode: '',
    CounterOfReconnections: '',
    SubscriptionNumber: '',
    Reasoncode: 'CREQ',
    UpgradeDwngInd: 'Null',
    CurrentRGWSupported: 'Yes',
    EquipValidFlag: '',
    freePromotionalDiscount: '',
    isRm38: 'No',
    CounterOfPackageSwitches: '',
    CoolingOffRequired: 'PleaseSpecify',
    SalesPersonCode: 'ADV',
    SalesPersonStaffID: 'WA',
    PromotionStartDate: '',
    ActivationDate: 'DT',
    CustomerVerified: 1,
    Contract: 'None',
    DealerType: 'Astro',
    x_E_signature_order: 'O',
    Dummy4: '',
    FreeSatNDS: 86,
    DowngradeIndAMSS: 0,
    RelatedProductID: '',
    Emp1stSubDiscount: 'No',
    RetailerCode: '',
    ASSOCIATED_PPV_EVENTCO: '',
    FormSignDate: '21/09/2020 10:01:25:DT',
    OriginalSRD: '',
    ARPU: '',
    DowngradeIndicator: 'No',
    CampaignType: 'Regular',
    HouseHoldID: '',
    x_E_signarure_option: 'No',
    MyKAD: '',
    EligibleForBonusChannel: 'No',
    DCSSMDU: 'NA',
    salesforce_lead_id: '',
    GEOZONEX9: '',
    Dummy5: '',
    Final_settlement_amount: '',
    SubscriptionMethod: 'selfservice',
    OldCustomerID: '',
    Expired_Contract_ID: ''
  },
  CampaignTerms: {
    ChargeCode: 'REGEC',
    waivePenality: 'No',
    commitmentPeriod: 24,
    commitmentPenality: 0.0,
    SusPenality: '',
    ConsolidationCampiagnCode: 'ZWK99RES',
    AstroFeeChargeCode: 'INSTALGFHDAR',
    SusPenalty: '',
    CalcInstDeposit: 'Yes',
    SalesProfile: 'DS,RT,TM',
    MinimumSubscrpitionFee: 39.95,
    CommitmentPenaltyFee: 1000.0,
    InstallerFeeChargeCode: 'INSTALGFHDIR',
    CommitmentEndDate: '21/09/2022 23:59:59:DT',
    MarketingPromo: 'FY20SpecialOnlineAssisted',
    AstroFee: 0,
    FulfillmentCategory: 'FOC',
    isRebateApply: 'No',
    InstallerFee: 60,
    FulfillmentPrice: 0.0,
    Installer_fees_Paid: 'Yes',
    PenaltyPaid: 'No',
    CampaignCode: 'ZWK99RES',
    IPTV_OptOut_Indicator: '',
    BillCommitmentEndDate: '2022-09-21 23:59:59',
    PenaltyPaidByDonatingCust: 'No',
    Is_Penalty_Prorated: 'YES'
  },
  installerInformation: {},
  smartCard: {
    Returnind: 'To be returned',
    BouqeteId: 2.0,
    ReturnDate: '',
    smartCardNo: '',
    SmartcardType: 'NDS',
    CardNickname: '',
    RulesFiredOnNPCInit: '',
    Validate_Eqipment: '',
    ODUInventoryType: 'SODU'
  },
  decoder: {
    ReplaceCamCode: 'RP!',
    CounterofPairingChange: 0,
    AcquasitionType: 'solid',
    DecoderWannPeriod: 12,
    RulesFiredOnNPCInit: 'No',
    CaseId: '',
    ReturnId: 'To be returned',
    SerailNo: '',
    Multicast_issue_ind: 'No',
    DecoderType: 'ZAPPER',
    NumAddTv: 0,
    DecoderEffectiveDate: '',
    Manufacturer: '',
    CASTBID: '',
    ModelNo: '',
    SubBoxType: '',
    InstallWarPeriod: 6,
    PairingStatus: 'Soft Paired',
    HDWarrEnd: '',
    HDWarrPeriod: 12,
    DecoderWarrEnd: '21/09/2021 10:01:25:DT',
    InstallWarrEnd: '21/03/2021 10:01:25:DT',
    OldDecoderSerialNumber: '',
    DWarrEnd: 'DT'
  },
  packages: {
    HDBundleChannels: '',
    BasicPackageChineseFamilyPack: '',
    BasicPackageChineseFamilyExtraPack: '',
    PremiusChannelsABOAllMovies: '',
    BabyTvChannel: '',
    BoilyOneHD: '',
    RTV: '',
    KoreanPack: '',
    PairingOverride: '',
    PDLEnablerSerivce: '',
    MiniPackages: '',
    ChineseFamilyPAck: ''
  },
  pairingChannel: {
    TechnicalComponent: null,
    TVPlan: null,
    Decoder: null,
    PrepaidVoucher: null,
    Packages: null,
    HDServices: null,
    SVODPackages: null,
    CampaignTerms: null,
    AddonEquipment: null,
    Smartcard: null
  }
};

const accountPassedMock = {
  resultcode: '01',
  body: {
    'Account ID': 'xxxx',
    '10 digit Account ID': 'xxxxxx',
    'Account Name': 'xxxx',
    'IC Number': 'xxxxx',
    'IC Type': 'xxxxxxxxxx',
    'VIP Status': 'xxxxx',
    'Customer Type': 'xxxx',
    'Bill Frequency': 'xxxx',
    'Payment Type': 'xxx',
    'Last CC/DD Extraction': 'xxx',
    'AR Balance': 'xxxxx',
    'Account Status': 'xxxx',
    'Bill Cycle Code': 'xxxx',
    'New Bill Cycle Code': 'xxx',
    'Old Bill Cycle Exp Date': 'xxxx'
  }
};

const accountFailedMock = {
  resultcode: '05',
  body: 'Error'
};

const contactPassedMock = {
  resultcode: '01',
  body: {
    contact_name: 'xxxx',
    account_name: 'xxxxx',
    primary_phone: 'xxx',
    office_phone: 'xxxxxxxxxx',
    mobile_phone: 'xxxxxxxxxx',
    home_phone: 'xxxxxxxxxx',
    fax: 'xxxxxxx',
    email: 'xxxxxxx@mail.com',
    race: 'xxxxx',
    dob: 'xxx',
    nationality: 'xxxxxx',
    vip_status: 'xx'
  }
};

const contactFailedMock = {
  resultcode: '05',
  body: 'Error'
};

const pdpaPassedMockData = {
  resultcode: '01',
  body: {
    contact_name: 'xxxx',
    account_name: 'xxxxx',
    primary_phone: 'xxx',
    office_phone: 'xxxxxxxxxx',
    mobile_phone: 'xxxxxxxxxx',
    home_phone: 'xxxxxxxxxx',
    fax: 'xxxxxxx',
    email: 'xxxxxxx@mail.com',
    race: 'xxxxx',
    dob: 'xxx',
    nationality: 'xxxxxx',
    vip_status: 'xx'
  }
};

const pdpaFailedMockData = {
  resultcode: '05',
  body: 'Error'
};

const priceCalculatorInfoPassed = {
  resultcode: '01',
  body: [
    {
      title: 'STARTER PACK',
      plan: {
        cid: '1483526',
        offer_name: 'PRIMARY PACK'
      },
      cust_comm_msg: {
        en: '',
        ml: '',
        zh: ''
      },
      priority: '1'
    }
  ]
};

const priceCalculatorInfoFailed = {
  resultcode: '05',
  body: 'Error'
};

const priceCalculatorCatalogInfoPassed = {
  resultcode: '01',
  body: {
    id: '2204420757',
    parentProductRef: {},
    customerRef: {
      id: '114721897'
    },
    status: 'Active',
    offering: {
      id: '39826',
      name: 'Family IPTV',
      productSpecification: {
        id: '38346',
        type: 'productSpec'
      },
      type: 'DTH',
      packages: [
        {
          description:
            'This Grouping Component contains Family Package, Chinese Family, Family HD, Chinese Family HD',
          name: 'Basic Packages',
          subPackages: [
            {
              id: '661',
              name: 'Family'
            },
            {
              id: '465823',
              name: 'Family Extra'
            }
          ]
        }
      ],
      broadbandServiceInfo: {
        speed: '13',
        speedName: '10Mbps',
        serviceProvider: 'TIME',
        isUpgradable: false
      },
      installationOptions: {
        InstallationCategory: 'AstroInstall',
        viewingOption: 'UNICAST'
      },
      price: [
        {
          type: 'oneTime',
          amount: {
            currencyCode: 'MYR',
            value: 0
          }
        }
      ],
      contract: {
        commitment: {
          leftDuration: '12',
          period: {
            endDate: ''
          },
          penaltyAmount: '123'
        }
      },
      extension: {
        isBroadBandDTH: false
      }
    },
    physicalResources: [
      {
        id: 'DTV2DB1810002132',
        type: 'Decoder',
        name: 'HD PVR',
        extension: {
          promotion: {
            id: 'FamilyPack10MbpsTIME'
          },
          campaign: {
            id: 'W11ACRES'
          }
        }
      }
    ]
  }
};

const priceCalculatorCatalogInfoFailed = {
  resutlcode: '05',
  body: 'Error'
};

const packsBySmcPassed = {
  resultcode: '01',
  body: [
    {
      CID: '8478495',
      SERVICE_TYPE: 'SUPG',
      DESCRIPTION: 'Add-on Equipment'
    }
  ]
};

const packsBySmcFailed = {
  resultcode: '05',
  body: 'Error'
};

// const orderDetailsMockResponse = [
//   {
//     'Offer Name': 'Value Pack 3b',
//     ITEM_DEF_ID: '451',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-09-18T16:07:56.000Z',
//     'Installation Address': null,
//     'Service Type': 'Subscription Main Component',
//     'Initial Provisioning Date': null,
//     Subscriber: 'Anonymous ',
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List':
//       'isCPVRVisible+Yes;CardNickname+;IsBroadbandDTH+No;FirstTimePackageUpgrade+No;Customer_Override_Activity+;FormSerialNumber+;PromotionEndDate+;IsExistingDbb+No;Category_Type+HD;NGVRCoverrideamount+0;PrimaryARPU+;SuspensionLevel+NONE;IsFulfillmentRequired+;PrimarySubscription+Yes;RLC_Commitment period in months+6;ISIVPSubscription+No;NGV_RC_Override_Ind+Y;RetailerName+;InstallerCode+;CounterOfReconnections+;SubscriptionNumber+;Reasoncode+CREQ;UpgradeDwngInd+Null;CurrentRGWSupported+Yes;EquipValidFlag+;freePromotionalDiscount+;isRm38+No;CounterOfPackageSwitches+;CoolingOffRequired+PleaseSpecify;SalesPersonCode+ADV;SalesPersonStaffID+WA;PromotionStartDate+;ActivationDate++DT;CustomerVerified+1;Contract+None;DealerType+Astro;x_E_signature_order+O;Dummy4+;FreeSatNDS+86;DowngradeIndAMSS+0;RelatedProductID+;Emp1stSubDiscount+No;RetailerCode+;ASSOCIATED_PPV_EVENTCO+;FormSignDate+18/09/2020 16:06:54+DT;OriginalSRD+;ARPU+;DowngradeIndicator+No;CampaignType+Regular;HouseHoldID+;x_E_signarure_option+No;MyKAD+;EligibleForBonusChannel+No;DCSSMDU+NA;salesforce_lead_id+;GEOZONEX9+;Dummy5+;Final_settlement_amount+;SubscriptionMethod+selfservice;OldCustomerID+;Expired_Contract_ID+',
//     MAIN_IND: '1',
//     'Service Type Code': 'TVMC',
//     AP_ID: '2329305216',
//     SERVICE_ID: null,
//     ORDERID: '1234'
//   },
//   {
//     'Offer Name': null,
//     ITEM_DEF_ID: '461833',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
//     'Installation Address': null,
//     'Service Type': 'Grouping Component',
//     'Initial Provisioning Date': null,
//     Subscriber: null,
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List': '',
//     MAIN_IND: '0',
//     'Service Type Code': 'GRP',
//     AP_ID: '2329305257',
//     SERVICE_ID: null,
//     ORDERID: '1234'
//   },
//   {
//     'Offer Name': null,
//     ITEM_DEF_ID: '12114375',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
//     'Installation Address': null,
//     'Service Type': 'Grouping Component',
//     'Initial Provisioning Date': null,
//     Subscriber: null,
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List': '',
//     MAIN_IND: '0',
//     'Service Type Code': 'GRP',
//     AP_ID: '2329305220',
//     SERVICE_ID: null,
//     ORDERID: '1234'
//   },
//   {
//     'Offer Name': null,
//     ITEM_DEF_ID: '1481',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-09-18T16:07:56.000Z',
//     'Installation Address': null,
//     'Service Type': 'STB',
//     'Initial Provisioning Date': null,
//     Subscriber: null,
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List':
//       'ReplaceCamCode+RP1;CounterOfPairingChange+0;AcquisitionType+Sold;DecoderWarrPeriod+12;RulesFiredOnNPCInit+No;HDWarrPeriod+12;CaseId+;ReturnInd+To Be Returned;SerialNo+;DecoderWarrEnd+18/09/2021 16:06:54+DT;MultiCast_Issue_Ind+No;InstallWarrEnd+18/03/2021 16:06:54+DT;DecoderType+ZAPPER;NumAddlTV+0;DecoderEffectiveDate++DT;Manufacturer+;CASTBID+;OldDecoderSerialNumber+;ModelNo+;SubBoxType+;InstallWarrPeriod+6;PairingStatus+Soft Paired;HDWarrEnd++DT',
//     MAIN_IND: '0',
//     'Service Type Code': 'STB',
//     AP_ID: '2329305242',
//     SERVICE_ID: 'unknown',
//     ORDERID: '1234'
//   },
//   {
//     'Offer Name': null,
//     ITEM_DEF_ID: '1951',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
//     'Installation Address': null,
//     'Service Type': 'Grouping Component',
//     'Initial Provisioning Date': null,
//     Subscriber: null,
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List': '',
//     MAIN_IND: '0',
//     'Service Type Code': 'GRP',
//     AP_ID: '2329305231',
//     SERVICE_ID: null,
//     ORDERID: '1234'
//   },
//   {
//     'Offer Name': null,
//     ITEM_DEF_ID: '381',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-09-18T16:07:56.000Z',
//     'Installation Address': null,
//     'Service Type': 'Grouping Component',
//     'Initial Provisioning Date': null,
//     Subscriber: null,
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List':
//       'Penalty+;PromotionStartDate+;PromotionEndDate+;Commitment_Type+;UpgradeDwngInd+Null;PackageCommitmentEndDate+16/03/2021 23:59:59;PackageList+CH_FAMILY, DYNASTY, HD_Bundle_Channels, Korean_Pack, NEWEMPEROR, Premier_League_Pack, TV_PLAN;ReplaceDwngEnabler+No;Packagecommitmentstartdate+18/09/2020 23:59:59;RemoveSwitchContract+N;Packagecommitmentduration+6',
//     MAIN_IND: '0',
//     'Service Type Code': 'GRP',
//     AP_ID: '2329305219',
//     SERVICE_ID: null,
//     ORDERID: '1234'
//   },
//   {
//     'Offer Name': null,
//     ITEM_DEF_ID: '481',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
//     'Installation Address': null,
//     'Service Type': 'Grouping Component',
//     'Initial Provisioning Date': null,
//     Subscriber: null,
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List':
//       'Total_Mini_Selected+0;Add_on_Mini_Price +12.72;Rate_of_Charged_Mini+0;No_of_Free_Mini+0',
//     MAIN_IND: '0',
//     'Service Type Code': 'GRP',
//     AP_ID: '2329305222',
//     SERVICE_ID: null,
//     ORDERID: '1234'
//   },
//   {
//     'Offer Name': null,
//     ITEM_DEF_ID: '511',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
//     'Installation Address': null,
//     'Service Type': 'Grouping Component',
//     'Initial Provisioning Date': null,
//     Subscriber: null,
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List': '',
//     MAIN_IND: '0',
//     'Service Type Code': 'GRP',
//     AP_ID: '2329305223',
//     SERVICE_ID: null,
//     ORDERID: '1234'
//   },
//   {
//     'Offer Name': null,
//     ITEM_DEF_ID: '517465',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
//     'Installation Address': null,
//     'Service Type': 'Grouping Component',
//     'Initial Provisioning Date': null,
//     Subscriber: null,
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List': '',
//     MAIN_IND: '0',
//     'Service Type Code': 'GRP',
//     AP_ID: '2329305239',
//     SERVICE_ID: null,
//     ORDERID: '1234'
//   },
//   {
//     'Offer Name': null,
//     ITEM_DEF_ID: '541',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-12-16T00:54:38.000Z',
//     'Installation Address': null,
//     'Service Type': 'Commitment',
//     'Initial Provisioning Date': null,
//     Subscriber: null,
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List':
//       'Chargecode+REGEC;CommitmentPeriod+24;WaivePenalty+No;CommitmentPenalty+0.0;AstroFeeChargeCode+INSTALGFHDAR;SusPenalty+;ConsolidatedCampaignCode+ZWK99RES;CalcInstDeposit+Yes;SalesProfile+DS,RT,TM;MinimumSubscrpitionFee+39.95;CommitmentPenaltyFee+1000.0;InstallerFeeChargeCode+INSTALGFHDIR;CommitmentEndDate+18/09/2022 23:59:59+DT;MarketingPromo+FY20SpecialOnlineAssisted;AstroFee+0;FulfillmentCategory+FOC;isRebateApply+No;InstallerFee+60;FulfillmentPrice+0.0;Installer_fees_Paid+Yes;PenaltyPaid+No;CampaignCode+ZWK99RES;IPTV_OptOut_Indicator+;BillCommitmentEndDate+2022-09-18 23:59:59;PenaltyPaidByDonatingCust+No;Is_Penalty_Prorated+YES',
//     MAIN_IND: '0',
//     'Service Type Code': 'COMM',
//     AP_ID: '2329305218',
//     SERVICE_ID: null,
//     ORDERID: '1234'
//   },
//   {
//     'Offer Name': null,
//     ITEM_DEF_ID: '5441',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
//     'Installation Address': null,
//     'Service Type': 'Grouping Component',
//     'Initial Provisioning Date': null,
//     Subscriber: null,
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List': '',
//     MAIN_IND: '0',
//     'Service Type Code': 'GRP',
//     AP_ID: '2329305225',
//     SERVICE_ID: null,
//     ORDERID: '1234'
//   },
//   {
//     'Offer Name': null,
//     ITEM_DEF_ID: '921',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-09-18T16:07:56.000Z',
//     'Installation Address': null,
//     'Service Type': 'SmartCard',
//     'Initial Provisioning Date': null,
//     Subscriber: null,
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List':
//       'ReturnInd+To Be Returned;OldSmartCardSerialNumber+;BouquetID+E0E2;ReturnDate++DT;ODUInventoryType+SODU;SmartcardType+NDS;CardNickname+;SmartcardNo+;RulesFiredOnNPCInit+No;Validate_Equiptment+',
//     MAIN_IND: '0',
//     'Service Type Code': 'SMC',
//     AP_ID: '2329305246',
//     SERVICE_ID: 'unknown',
//     ORDERID: '1234'
//   },
//   {
//     'Offer Name': null,
//     ITEM_DEF_ID: '931366',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
//     'Installation Address': null,
//     'Service Type': 'Grouping Component',
//     'Initial Provisioning Date': null,
//     Subscriber: null,
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List': 'isCPVRVisible+Yes;Penalty+',
//     MAIN_IND: '0',
//     'Service Type Code': 'GRP',
//     AP_ID: '2329305236',
//     SERVICE_ID: null,
//     ORDERID: '1234'
//   },
//   {
//     'Offer Name': null,
//     ITEM_DEF_ID: '936076',
//     ORDER_MODE: 'DE',
//     State: 'Ordered',
//     Status: 'Active',
//     CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
//     'Installation Address': null,
//     'Service Type': 'Grouping Component',
//     'Initial Provisioning Date': null,
//     Subscriber: null,
//     'Order Action Reason': null,
//     'Group Level': 'Subscriber',
//     'Attribute List':
//       'isPaidStorage+No;ChannelCode+500;ChannelName+200hrs;CPVRWeight+500',
//     MAIN_IND: '0',
//     'Service Type Code': 'GRP',
//     AP_ID: '2329305237',
//     SERVICE_ID: null,
//     ORDERID: '1234'
//   }
// ];

const orderDetailsMockResponse = {
  ORDERID: '1234',
  leadOrderList: [
    {
      'Offer Name': 'Value Pack 3b',
      ITEM_DEF_ID: '451',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-09-18T16:07:56.000Z',
      'Installation Address': null,
      'Service Type': 'Subscription Main Component',
      'Initial Provisioning Date': null,
      Subscriber: 'Anonymous ',
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List':
        'isCPVRVisible+Yes;CardNickname+;IsBroadbandDTH+No;FirstTimePackageUpgrade+No;Customer_Override_Activity+;FormSerialNumber+;PromotionEndDate+;IsExistingDbb+No;Category_Type+HD;NGVRCoverrideamount+0;PrimaryARPU+;SuspensionLevel+NONE;IsFulfillmentRequired+;PrimarySubscription+Yes;RLC_Commitment period in months+6;ISIVPSubscription+No;NGV_RC_Override_Ind+Y;RetailerName+;InstallerCode+;CounterOfReconnections+;SubscriptionNumber+;Reasoncode+CREQ;UpgradeDwngInd+Null;CurrentRGWSupported+Yes;EquipValidFlag+;freePromotionalDiscount+;isRm38+No;CounterOfPackageSwitches+;CoolingOffRequired+PleaseSpecify;SalesPersonCode+ADV;SalesPersonStaffID+WA;PromotionStartDate+;ActivationDate++DT;CustomerVerified+1;Contract+None;DealerType+Astro;x_E_signature_order+O;Dummy4+;FreeSatNDS+86;DowngradeIndAMSS+0;RelatedProductID+;Emp1stSubDiscount+No;RetailerCode+;ASSOCIATED_PPV_EVENTCO+;FormSignDate+18/09/2020 16:06:54+DT;OriginalSRD+;ARPU+;DowngradeIndicator+No;CampaignType+Regular;HouseHoldID+;x_E_signarure_option+No;MyKAD+;EligibleForBonusChannel+No;DCSSMDU+NA;salesforce_lead_id+;GEOZONEX9+;Dummy5+;Final_settlement_amount+;SubscriptionMethod+selfservice;OldCustomerID+;Expired_Contract_ID+',
      MAIN_IND: '1',
      'Service Type Code': 'TVMC',
      AP_ID: '2329305216',
      SERVICE_ID: null,
      ORDERID: '1234'
    },
    {
      'Offer Name': null,
      ITEM_DEF_ID: '461833',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
      'Installation Address': null,
      'Service Type': 'Grouping Component',
      'Initial Provisioning Date': null,
      Subscriber: null,
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List': '',
      MAIN_IND: '0',
      'Service Type Code': 'GRP',
      AP_ID: '2329305257',
      SERVICE_ID: null,
      ORDERID: '1234'
    },
    {
      'Offer Name': null,
      ITEM_DEF_ID: '12114375',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
      'Installation Address': null,
      'Service Type': 'Grouping Component',
      'Initial Provisioning Date': null,
      Subscriber: null,
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List': '',
      MAIN_IND: '0',
      'Service Type Code': 'GRP',
      AP_ID: '2329305220',
      SERVICE_ID: null,
      ORDERID: '1234'
    },
    {
      'Offer Name': null,
      ITEM_DEF_ID: '1481',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-09-18T16:07:56.000Z',
      'Installation Address': null,
      'Service Type': 'STB',
      'Initial Provisioning Date': null,
      Subscriber: null,
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List':
        'ReplaceCamCode+RP1;CounterOfPairingChange+0;AcquisitionType+Sold;DecoderWarrPeriod+12;RulesFiredOnNPCInit+No;HDWarrPeriod+12;CaseId+;ReturnInd+To Be Returned;SerialNo+;DecoderWarrEnd+18/09/2021 16:06:54+DT;MultiCast_Issue_Ind+No;InstallWarrEnd+18/03/2021 16:06:54+DT;DecoderType+ZAPPER;NumAddlTV+0;DecoderEffectiveDate++DT;Manufacturer+;CASTBID+;OldDecoderSerialNumber+;ModelNo+;SubBoxType+;InstallWarrPeriod+6;PairingStatus+Soft Paired;HDWarrEnd++DT',
      MAIN_IND: '0',
      'Service Type Code': 'STB',
      AP_ID: '2329305242',
      SERVICE_ID: 'unknown',
      ORDERID: '1234'
    },
    {
      'Offer Name': null,
      ITEM_DEF_ID: '1951',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
      'Installation Address': null,
      'Service Type': 'Grouping Component',
      'Initial Provisioning Date': null,
      Subscriber: null,
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List': '',
      MAIN_IND: '0',
      'Service Type Code': 'GRP',
      AP_ID: '2329305231',
      SERVICE_ID: null,
      ORDERID: '1234'
    },
    {
      'Offer Name': null,
      ITEM_DEF_ID: '381',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-09-18T16:07:56.000Z',
      'Installation Address': null,
      'Service Type': 'Grouping Component',
      'Initial Provisioning Date': null,
      Subscriber: null,
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List':
        'Penalty+;PromotionStartDate+;PromotionEndDate+;Commitment_Type+;UpgradeDwngInd+Null;PackageCommitmentEndDate+16/03/2021 23:59:59;PackageList+CH_FAMILY, DYNASTY, HD_Bundle_Channels, Korean_Pack, NEWEMPEROR, Premier_League_Pack, TV_PLAN;ReplaceDwngEnabler+No;Packagecommitmentstartdate+18/09/2020 23:59:59;RemoveSwitchContract+N;Packagecommitmentduration+6',
      MAIN_IND: '0',
      'Service Type Code': 'GRP',
      AP_ID: '2329305219',
      SERVICE_ID: null,
      ORDERID: '1234'
    },
    {
      'Offer Name': null,
      ITEM_DEF_ID: '481',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
      'Installation Address': null,
      'Service Type': 'Grouping Component',
      'Initial Provisioning Date': null,
      Subscriber: null,
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List':
        'Total_Mini_Selected+0;Add_on_Mini_Price +12.72;Rate_of_Charged_Mini+0;No_of_Free_Mini+0',
      MAIN_IND: '0',
      'Service Type Code': 'GRP',
      AP_ID: '2329305222',
      SERVICE_ID: null,
      ORDERID: '1234'
    },
    {
      'Offer Name': null,
      ITEM_DEF_ID: '511',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
      'Installation Address': null,
      'Service Type': 'Grouping Component',
      'Initial Provisioning Date': null,
      Subscriber: null,
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List': '',
      MAIN_IND: '0',
      'Service Type Code': 'GRP',
      AP_ID: '2329305223',
      SERVICE_ID: null,
      ORDERID: '1234'
    },
    {
      'Offer Name': null,
      ITEM_DEF_ID: '517465',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
      'Installation Address': null,
      'Service Type': 'Grouping Component',
      'Initial Provisioning Date': null,
      Subscriber: null,
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List': '',
      MAIN_IND: '0',
      'Service Type Code': 'GRP',
      AP_ID: '2329305239',
      SERVICE_ID: null,
      ORDERID: '1234'
    },
    {
      'Offer Name': null,
      ITEM_DEF_ID: '541',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-12-16T00:54:38.000Z',
      'Installation Address': null,
      'Service Type': 'Commitment',
      'Initial Provisioning Date': null,
      Subscriber: null,
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List':
        'Chargecode+REGEC;CommitmentPeriod+24;WaivePenalty+No;CommitmentPenalty+0.0;AstroFeeChargeCode+INSTALGFHDAR;SusPenalty+;ConsolidatedCampaignCode+ZWK99RES;CalcInstDeposit+Yes;SalesProfile+DS,RT,TM;MinimumSubscrpitionFee+39.95;CommitmentPenaltyFee+1000.0;InstallerFeeChargeCode+INSTALGFHDIR;CommitmentEndDate+18/09/2022 23:59:59+DT;MarketingPromo+FY20SpecialOnlineAssisted;AstroFee+0;FulfillmentCategory+FOC;isRebateApply+No;InstallerFee+60;FulfillmentPrice+0.0;Installer_fees_Paid+Yes;PenaltyPaid+No;CampaignCode+ZWK99RES;IPTV_OptOut_Indicator+;BillCommitmentEndDate+2022-09-18 23:59:59;PenaltyPaidByDonatingCust+No;Is_Penalty_Prorated+YES',
      MAIN_IND: '0',
      'Service Type Code': 'COMM',
      AP_ID: '2329305218',
      SERVICE_ID: null,
      ORDERID: '1234'
    },
    {
      'Offer Name': null,
      ITEM_DEF_ID: '5441',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
      'Installation Address': null,
      'Service Type': 'Grouping Component',
      'Initial Provisioning Date': null,
      Subscriber: null,
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List': '',
      MAIN_IND: '0',
      'Service Type Code': 'GRP',
      AP_ID: '2329305225',
      SERVICE_ID: null,
      ORDERID: '1234'
    },
    {
      'Offer Name': null,
      ITEM_DEF_ID: '921',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-09-18T16:07:56.000Z',
      'Installation Address': null,
      'Service Type': 'SmartCard',
      'Initial Provisioning Date': null,
      Subscriber: null,
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List':
        'ReturnInd+To Be Returned;OldSmartCardSerialNumber+;BouquetID+E0E2;ReturnDate++DT;ODUInventoryType+SODU;SmartcardType+NDS;CardNickname+;SmartcardNo+;RulesFiredOnNPCInit+No;Validate_Equiptment+',
      MAIN_IND: '0',
      'Service Type Code': 'SMC',
      AP_ID: '2329305246',
      SERVICE_ID: 'unknown',
      ORDERID: '1234'
    },
    {
      'Offer Name': null,
      ITEM_DEF_ID: '931366',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
      'Installation Address': null,
      'Service Type': 'Grouping Component',
      'Initial Provisioning Date': null,
      Subscriber: null,
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List': 'isCPVRVisible+Yes;Penalty+',
      MAIN_IND: '0',
      'Service Type Code': 'GRP',
      AP_ID: '2329305236',
      SERVICE_ID: null,
      ORDERID: '1234'
    },
    {
      'Offer Name': null,
      ITEM_DEF_ID: '936076',
      ORDER_MODE: 'DE',
      State: 'Ordered',
      Status: 'Active',
      CTDB_UPD_DATETIME: '2020-09-18T16:06:54.000Z',
      'Installation Address': null,
      'Service Type': 'Grouping Component',
      'Initial Provisioning Date': null,
      Subscriber: null,
      'Order Action Reason': null,
      'Group Level': 'Subscriber',
      'Attribute List':
        'isPaidStorage+No;ChannelCode+500;ChannelName+200hrs;CPVRWeight+500',
      MAIN_IND: '0',
      'Service Type Code': 'GRP',
      AP_ID: '2329305237',
      SERVICE_ID: null,
      ORDERID: '1234'
    }
  ]
};
const subscriptionPackagePriceMockData = {
  DESCRIPTION: 'Family+3Mini',
  AMOUNT: 62.95
};

const subscriptionMockData = [
  {
    'Subscriber No': 253528815,
    'Smart Card No': '016600528067',
    Status: 'INSTALLED',
    'Status Date': '05-Dec-2014 02:01:20 PM',
    Packages: 'Flat RM 50 RC for EMP - Effective Date : 01-OCT-18',
    Account_Id: 86685253,
    DMT: 'SFH1CC1852012407',
    Paired: 'Hard Paired',
    StatusDate: '05-Dec-2014 02:01:20 PM',
    CampaignCode: 'UHD010RES',
    ARPU_BT: 50,
    ARPU_AT: 53,
    CommStartDate: '2019-12-10T00:00:00.000Z',
    CommEndDate: '2019-12-10T00:00:00.000Z',
    MinSubFee: '39.99',
    BouquetID: 'E0F1',
    'ISP Name': '',
    'Voice Service Indicator': '',
    BBAttributes: ''
  },
  {
    'Subscriber No': 340737578,
    'Smart Card No': '016000783189',
    Status: 'INSTALLED',
    'Status Date': '06-Sep-2018 10:01:07 AM',
    Packages: 'Flat RM 50 RC for EMP - Effective Date : 01-OCT-18',
    Account_Id: 86685253,
    DMT: 'DTV2CA1708031517',
    Paired: 'Hard Paired',
    StatusDate: '06-Sep-2018 10:01:07 AM',
    CampaignCode: 'WAE55RES',
    ARPU_BT: 50,
    ARPU_AT: 53,
    CommStartDate: '2018-01-11T00:00:00.000Z',
    CommEndDate: '2018-01-11T00:00:00.000Z',
    MinSubFee: '59.9',
    BouquetID: 'E0E2',
    'ISP Name': '',
    'Voice Service Indicator': '',
    BBAttributes: ''
  },
  {
    'Subscriber No': 205967601,
    'Smart Card No': '015036275327',
    Status: 'INSTALLED',
    'Status Date': '04-Jul-2010 ',
    Packages:
      'ABO Thangathirai - Effective Date : 27-MAY-21,ABO Thangathirai - Effective Date : 27-MAY-21,Employee Pack - Effective Date : 27-MAY-21,Employee Pack - Effective Date : 27-MAY-21',
    Account_Id: 86685253,
    DMT: 'DTV2AA1702001905',
    Paired: 'Hard Paired',
    StatusDate: '04-Jul-2010 ',
    CampaignCode: 'WA499RES',
    ARPU_BT: 3,
    ARPU_AT: 3.18,
    CommStartDate: '2017-04-13T00:00:00.000Z',
    CommEndDate: '2017-04-13T00:00:00.000Z',
    MinSubFee: '0.0',
    BouquetID: 'E0E2',
    'ISP Name': '',
    'Voice Service Indicator': '',
    BBAttributes: ''
  },
  {
    'Subscriber No': 206121674,
    'Smart Card No': '015030496168',
    Status: 'INSTALLED',
    'Status Date': '06-May-2011 02:24:43 PM',
    Packages: 'Flat RM 50 RC for EMP - Effective Date : 01-OCT-18',
    Account_Id: 86685253,
    DMT: 'HDZPCA1304006479',
    Paired: 'Hard Paired',
    StatusDate: '06-May-2011 02:24:43 PM',
    CampaignCode: 'ZED55RES',
    ARPU_BT: 50,
    ARPU_AT: 53,
    CommStartDate: '2017-10-30T00:00:00.000Z',
    CommEndDate: '2017-10-30T00:00:00.000Z',
    MinSubFee: '50.0',
    BouquetID: 'E0E2',
    'ISP Name': '',
    'Voice Service Indicator': '',
    BBAttributes: ''
  }
];

const subscriptionPackageInfoMockData = {
  service: 'Decoder-DMT4-880',
  servicetype: '',
  resourceid: '95888TC1071869',
  status: 'Active',
  StartDate: '26-Jul-2013 09:15:22 PM',
  ServiceEndDate: '19-Jan-2038 11:14:07 AM',
  commitmentenddate: ''
};

const leadOverviewMockData = {
  leadOverview: {
    OBJID: 20122,
    X_LEAD2BILLING_ADDR: 80056395,
    X_LEAD2SERVICE_ADDR: 80056394,
    X_PROSPECT_ID: 2021,
    Salutation: 'DATIN',
    Name: 'JOHN LEE',
    'ID Type': 'NRIC',
    'ID No.': '910302123123',
    'Account Name': null,
    'Company Name': null,
    'Campaign Info': 0,
    'Site Name': null,
    Address: 'JALAN CHANGKAT HARTAMAS 2',
    'Address 2': null,
    City: 'KUALA LUMPUR',
    State: 'WIL',
    PostCode: '50480',
    Country: 'Malaysia',
    'Time Zone': 'GMT+8',
    'Phone No.': '0123456789',
    'Lead Stage': 'Unqualified',
    Rating: 'Please Specify',
    'Home Phone No.': null,
    'Mobile No.': '0123456789',
    Email: 'abc@gmail.com',
    Fax: null,
    'Job Title': null,
    Status: 'Inactive',
    Owner: 'DEX_RETAILER',
    Campaign: 'Default Campaign',
    'Lead Source': 'Churn Failed Lead',
    Comments: 'MYKAD:876587658765;',
    'Home Ownership': 'Self Owned',
    'Dwelling Type': 'CONDO/APARTMENT',
    'Customer Type': 'REGULAR',
    'Customer Sub Type': 'Normal'
  },
  addresses: [
    {
      ADD_TYPE: 'Billing Address',
      'Address 1': 'RADIA RESIDENCY',
      'Address 2': null,
      'Address 3': 'D-01-03,JALAN SINGAHSANA',
      'Address 4': 'SEKSEN U8',
      'Address 5': '40150,Shah Alam,SEL'
    },
    {
      ADD_TYPE: 'Service Address',
      'Address 1': 'RADIA RESIDENCY',
      'Address 2': null,
      'Address 3': 'D-01-03,JALAN SINGAHSANA',
      'Address 4': 'SEKSEN U8',
      'Address 5': '40150,Shah Alam,SEL'
    }
  ],
  moreInfo: {
    x_bill_format: 'E',
    x_dob: '1977-12-15 07:30:00',
    x_gender: 'MALE',
    x_is_contact_premium: 'NO',
    x_is_existing_contact: 'YES',
    x_office_phone: null,
    x_order_id: '476383532A',
    x_pref_lang: 'ENGLISH',
    x_race: 'INDIAN',
    payment_details: 'Cash'
  },
  relatedAccounts: [
    {
      X_ACCOUNT_ID: '99111316',
      X_ACCOUNT_NAME: null
    }
  ]
};

const leadAttachmentMockData = {
  resultcode: '01',
  body: {
    Title: 'maskedPdf_536558187A',
    Description: 'Customer verification document from AMSS'
  }
};

const leadHistoryMockData = {
  resultcode: '01',
  body: {
    Activity: 'Lead Created',
    'Creation Time': '08-May-2020 02:36:04 PM',
    'Login Name': 'DEX_RETAILER',
    'Additional Information': 'New Lead: John Lee'
  }
};

const leadMockData = {
  resultcode: 200,
  body: {
    lead_id: '2345'
  }
};

const searchMockData = {
  resultcode: 200,
  body: {
    account_id: '23458793456'
  }
};

const recoRecommendationsMockData = [
  {
    title: 'SUPER PACK 1',
    plan: {
      cid: '1493456',
      offer_name: 'PLATINUM PACK'
    },
    add_on: [
      {
        cid: '1493906',
        offer_name: 'INDONESIAN FAVOURITES'
      }
    ],
    bb_recom: 'false',
    speed_upgrade_req: 'true',
    price: '284.99',
    broadband: {
      cid: '175528',
      isp_data: {
        isp_name: 'TM',
        product: 'FTTH',
        speed: '100Mbps',
        speedRefId: '101'
      }
    },
    cust_comm_msg: {
      en: 'Only pay RM43.99 for Netflix Premium; Even more attractive savings with broadband',
      ml: '',
      zh: ''
    },
    priority: '1'
  }
];

const freePreviewMockData = {
  SMC: 'xxxxx',
  Status: 'xxxxx',
  'Channel Name': 'xxxxx',
  'Channel Code': 'xxxxx',
  'Start Date': 'xxxxx',
  'End Date': 'xxxxx'
};

const netFlixMockData = [
  {
    SMC: 45673473453453,
    PAI: '',
    NetflixPackName: '',
    ChargeAmount: '',
    ActivationDate: '',
    LastChargeDate: '',
    LastTransactionID: '',
    NetflixInvoiceID: '',
    LastActivityDate: '',
    LastActivityType: '',
    'Response Message': '',
    NetFlixType: 'Bundle'
  },
  {
    SMC: 45673473453453,
    PAI: '',
    NetflixPackName: '',
    ChargeAmount: '',
    ActivationDate: '',
    LastChargeDate: '',
    LastTransactionID: '',
    NetflixInvoiceID: '',
    LastActivityDate: '',
    LastActivityType: '',
    'Response Message': '',
    NetFlixType: 'Bundle'
  }
];

const flashMessagesMockData = {
  Title: 'xxxx',
  StartDate: 'xxxxx',
  EndDate: 'xxxxx',
  Status: 'xxxxx',
  Description: 'xxxxx'
};

const winBackSummaryMockData = {
  CurrentCharges: 0,
  AmountDue: 0,
  ARBalance: 0,
  DebtAge: 0,
  InvoiceAge: 0,
  BillCycle: 0,
  Frequency: 0
};

const apgRpnMockData = {
  RPNEntriesStatus: {
    transactionDate: 'xxxxx',
    accountNo: 'xxxxx',
    amount: 99999999,
    creditCardNumber: '401200xxxxxx3335',
    expiryDate: 'xxxxx',
    transactionId: 'xxxxx',
    channel: 'xxxxx',
    paymentSourceId: 'xxxxx',
    partnerKey: 'xxxxx',
    cardType: 'xxxxx',
    activityType: 'xxxxx',
    paymentRefId: 'xxxxx',
    partnerUserKey: 'xxxxx',
    branchId: 'xxxxx'
  },
  PayflowRPNStatus: {
    proxyId: 99999,
    partnerId: 3,
    partner: {
      partnerId: 3,
      partnerKey: 'xxxxx',
      name: 'xxxxx',
      status: 'xxxxx',
      remarks: 'xxxxx',
      partnerConfig: 'xxxxx'
    },
    receiveDate: 1642641166000,
    lastModifiedDate: 1642641166000,
    transactionId: 'xxxxx',
    status: 'xxxxx',
    amount: 99999999,
    accountNo: 'xxxxx'
  },
  RPNStatus: {
    act_type: 'xxxxx',
    amdocs_count: 1,
    amdocs_error_code: 0,
    amdocs_error_msg: 'xxxxx',
    amt: 99999999,
    bank_cli_ref_id: 'xxxxx',
    bill_acc_no: 'xxxxx',
    branch_id: 'xxxxx',
    cc_exp_dt: 'xxxxx',
    cc_no: '401200xxxxxx3335',
    cc_type: 'xxxxx',
    created_at: 'xxxxx',
    error_code: 80,
    interac_pymt_chnl: 'xxxxx',
    message: 'xxxxx',
    ptr_id: 'xxxxx',
    ptr_user_key: 'xxxxx',
    pymt_meth: 'xxxxx',
    pymt_scr: 'xxxxx',
    pymt_scr_id: 'xxxxx',
    rpn_status: 'xxxxx',
    sys_type: 'xxxxx',
    teller_id: '',
    trans_dt: 'xxxxx',
    trans_st: 'xxxxx',
    trans_type: 'xxxxx',
    ttl_expiry: 1650445984034,
    unique_id: 'xxxxx'
  }
};

const campaignLogs = {
  body: {
    data: [{
      id: 658,
      campaign_status: 'Enabled',
      campaign_details: 'sd_dca_admin Enabled Campaign',
      activity_created_by: 'sd_dca_admin',
      activity_created_on: '2022-08-10T07:33:06.000Z'
    }]
  }
};

const campaignHistory = {
  body: {
    data: [{
      id: 402,
      user_id: 'sd_dca_admin',
      description: 'DCA_JUL22_CAM_20Jul.csv',
      file_location: 'https://tex-paign-bucket.s3.ap-southeast-1.amazonaws.com/DCA_JUL22_CAM_20Jul_1658317403689.csv',
      file_key: 'DCA_JUL22_CAM_20Jul_1658317403689.csv',
      upload_time: '2022-07-20T11:43:44.000Z',
      is_active: 'Y',
      enabled_flag: 'Y',
      total_records: 108492
    }]
  }
};

const activeDCACampaignHistory = {
  body: {
    data: [{
      id: 402,
      user_id: 'sd_dca_admin',
      description: 'DCA_JUL22_CAM_20Jul.csv',
      file_location: 'https://tex-campaign-bucket.s3.ap-southeast-1.amazonaws.com/DCA_JUL22_CAM_20Jul_1658317403689.csv',
      file_key: 'DCA_JUL22_CAM_20Jul_1658317403689.csv',
      upload_time: '2022-07-20T11:43:44.000Z',
      is_active: 'Y',
      enabled_flag: 'Y',
      total_records: 108492
    }]
  }
};

const downloadedCampaigns = {
  url: 'https://tex-campaign-bucket.s3.ap-southeast-1.amazonaws.com/TEST_AUG22_CAM_1660116587270.csv?AWSAccessKeyId=ASIA6E6ANG5D4BOG4R7Y&Expires=1660118160&Signature=dop1pdxcI9JGiObSwDGeOk4sZqQ%3D&x-amz-security-token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0xIkcwRQIgN%2FNKxphhyBb%2BviE8aiTFAKMadSXmNJtEails2wQ1akUCIQDSZBsFfajx3IczWb9X8LS7c%2F2PTlsAgIX3AJLCqT7t6irhBAhAEAIaDDk3MjY3Njc0MDkzNSIMFZcHhTw034jKxBqwKr4EYq3jDHZ7hn5Q31fm3JoEV3RG93Z%2FUaaRSCq5DFhn6puVE3rvJ89MxE9InWOeU9F8ikT2sZvKBeWN7QV%2BJHouvBcvek4LsPiHN5GxF7dQdmOk%2Bp6Wd%2FiWPjFEkNF7sPNpAG5l9%2FS7kXxCV4RSxxVwxVX1zYnExPGhsqQgCVDUbM%2FwDhhzV2fpPRtMWXYw0bKTbHB%2FrMfpKeq3q2hR8VZ3lSg2RjAAqNZH5Llh0xVY%2BG8QP88iqbmzDgajlVi%2BTVreb0u6WKGgiOU810GEVGAL2OWKg%2FvAiaVrdEP6jx%2FduTRXfNT6827mVrdJKt5qXKoOFVBtL57q2erjgPGPawNwG1MBMKjR09GQE%2BfQGhmtI1AxnpTaNu6ukXO8rf1uUnbJEFsuTRYFsUIwleWGhJ4ue2Qel5zWtK%2FWag9%2FsDipCehrPxHqHPMJnzPxXJtCQ%2BaDLMPw8slvhnSCluMHf2Y8m71tyuZPwrMkw21DEXrbdb5iBj%2BSaymjFN%2B8vXsUmggtZNK7MlR4qkJZeQIivRwVZJG5i0jqQXz%2Bk4qUVYc4ObovTVtXKEhuafuhOrfJBpuvUysCpUt2qoarwuGCO9%2Bql6CwXR%2FEPIZQfTEmnKFSw0dlylAgg5hUSLuM5RmR%2FKYYTK4gJOBCqJt9oFtVo6JNHmVzb%2BROeJwksBPv59FTejTuLykwy4plGcfPvu7151Mkvl5E%2FmDQCiViJC0X9KA0IeotDdQb75VjwSjllFCPCP3NZCcbI2DVWegoX1Tg1zDgpc2XBjqpASHtAumKT1rjk8J8vwIIvYy9RdDGU3ht9cHq8OK9h6ICpgMnrZ6R0NzjKHvAOvDTMnbJBHuva9NEjdFiCXcBlpjLAsZatO4qTmORBUwYVXB%2FNqHVBXLg7ODa8nCOmhEZV6t83pYRlSQ1PgUev1UHYvAsmz%2BL0aOrPCJ0nfUHpa4V3whmXY3zB5ptb5PG07n5GAQIcND5OJeoaYGhRZnd1MLBDowSA%2FFOl%2Bg%3D'
};

const uploadedCampaignMessage = {
  message: 'File upload in-progress. You will receive confirmation email..!'
};

const enableCampaignMessage = {
  body: {
    message: 'Campaign Disabled successfully..!'
  }
};

const agencyActivityUploadHistory = {
  body: {
    data: [
      {
        agency_code: 'admin',
        userID: 740,
        id: 190,
        user_id: 'sd_dca_admin',
        description: 'dca-activity-2506_1656402164554.csv',
        file_location: 'https://tex-agency-activity-bucket.s3.ap-southeast-1.amazonaws.com/dca-activity-2506_1656402164554_1660116135144.csv',
        file_key: 'dca-activity-2506_1656402164554_1660116135144.csv',
        upload_time: '2022-08-10T07:22:15.000Z',
        is_active: 'Y',
        total_records: 12
      }
    ]
  }
};

const agencyCode = [
  {
    agencyCode: '0000',
    agencyName: '0000'
  },
  {
    agencyCode: '12',
    agencyName: '12'
  }
];

const downloadedAgencyActivityFile = {
  url: 'https://tex-gency-activity-bucket.s3.ap-southeast-1.amazonaws.com/dca-activity-2506_1656428091974_1660115927754.csv?AWSAccessKeyId=ASIA6E6ANG5D7TT2YOB3&Expires=1660183094&Signature=OIrbukLv77RBfqEqt7MrG8UrlZI%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0xIkcwRQIgLQvWM46EgWPjanCT4J%2BkPkLvyGfdqeaBcri5uI5hcPUCIQDypao5foa0xBjOohTIDN3jL81JdcgXC5gnVV90vfLNZCrhBAhSEAIaDDk3MjY3Njc0MDkzNSIMMdGyJHxKoCXiulPUKr4E5t%2BOGScCQ1sd9OzXKIslvKJ7td25AE96lp5bwEtFZjrXWycZzyHasw70yOYkJC8rDKOffdKMzg0hQjnULc7bR7U%2FjgFhYWSk4oSwpJoHjZgQWmSjbUeRBiCk9UbzWZkiB1WCRlwkrtyRuXf09ZctlnljoDGIXoNxniPY4H95i5uGCSukTRQlBufUJBsyyymNA6l7OVevvmLGwLoTYw8bw2w5cFkxReHt2AckQYG0G9xsTpm6VvwjkFZ26MWuPHmFU4vEg2W%2BjUrgeoNo47iM2cWbAxHQmteminLkjIaGjbrNwtm6%2BhJAamDue7T2lA8rgdtP1%2F59kDKB6WvUCfloSA4qy73kBsiP438UpT%2F%2FZ115cH58Q1GZwls86fjPOK0JFi%2BzNcXlczboW75a1233ZxZ3qbi3Js087jfmUm9tCuKQbJXv3MDds1%2FNF6MNJG5V0pJgG0CUG4G9VHsf35So%2BzRbeJrf17k2yJOmL6rU6EGOzIWSBtuoGbxV%2BfwcyNRVOCYjObS0HHDYCfXq9tKfB4EOchQULQntv2JfBxcBOv0glHrf3KqYE1X71X2ecm5zuMCVQe8gmTFq87F3BEJjtwci4HLS3Tlu7zcbIibrdAf4Cyk2NxtfnA1CigKZ%2FM%2F5fPW%2Bprk7dFmbxx3EySAUDJE2CpQY92j5dXM9jhD5Z0o9gBqJfhwkw6wDnbgjCdNu4ZlUQe0rWSlF2afjauBc3gEVFCfTENbJYtnPqLHayyvI%2FLklHcDTu1XcrI3zczDgr9GXBjqpAWzbwtox%2FtUnLLpiIijJbb6xiW3e4VK4YfCDQE1jFZOKzCX9nJWpE2RzAlsbDKbvfQGYucT736MFjfwi5s%2FyZFdaGlcmyyu63IMKq6lAW4Xqt8y3dIXqH6s8dHhhV67CEV83WNDrzQrax3G83%2BHdqdsN0lcxpzv85%2Fekyme6fXHmiLx0i7At6%2Ft7aBTNwjw%2Fz2aqNb4cKqZf84N%2BvCOY6PE74rZW3XjYLao%3D'
};

const uploadAgencyActivityFile = {
  message: 'File Upload Successful..!'
};

const bulkDownloadAgencyActivityZip = 'AgencyActivity-1660183874841.zip';

const dcaUsersListPass = {
  resultcode: '01',
  body: [{
    contactNumber: '0000000000',
    createdBy: 'superadmin',
    creationDate: '2022-07-20T11:06:29.000Z',
    email: 'donotreply_ucip@astro.com.my',
    enabled: true,
    firstName: 'Test',
    forceReset: 0,
    id: 1024,
    isActive: 1,
    lastName: 'Test',
    notes: '-',
    roleId: 4,
    status: 'CONFIRMED',
    updationDate: '2022-07-20T11:06:29.000Z',
    username: 'cip-business-astro-admin-01'
  }]
};

const dcaUsersListFailed = {
  resultcode: '05',
  body: 'Error: Dca Users List Failed'
};

const ulmUnlinkPass = {
  resultcode: '01',
  body: { isUnLinked: true }
};

const ulmUnlinkFailed = {
  resultcode: '05',
  body: 'Error: ulm unlink failed'
};

const flashMessagesPassed = {
  resultcode: '01',
  body: {
    Title: 'xxxx',
    StartDate: 'xxxxx',
    EndDate: 'xxxxx',
    Status: 'xxxxx',
    Description: 'xxxxx'
  }
};

const flashMessagesFailed = {
  resultcode: '05',
  body: 'Error'
};

const netFlixPassedMockData = {
  resultcode: '01',
  body: [
    {
      SMC: 45673473453453,
      PAI: '',
      NetflixPackName: '',
      ChargeAmount: '',
      ActivationDate: '',
      LastChargeDate: '',
      LastTransactionID: '',
      NetflixInvoiceID: '',
      LastActivityDate: '',
      LastActivityType: '',
      'Response Message': '',
      NetFlixType: 'Bundle'
    }
  ]
};

const netFlixFailedMockData = {
  resultcode: '05',
  body: 'Error'
};

const searchMockDataPassed = {
  resultcode: '01',
  body: {
    account_id: '23458793456'
  }
};

const searchMockDataFailed = {
  resultcode: '05',
  body: 'Error'
};

const freePreviewMockDataPassed = {
  resultcode: '01',
  body: {
    SMC: 'xxxxx',
    Status: 'xxxxx',
    'Channel Name': 'xxxxx',
    'Channel Code': 'xxxxx',
    'Start Date': 'xxxxx',
    'End Date': 'xxxxx'
  }
};

const freePreviewMockDataFailed = {
  resultcode: '05',
  body: 'Error'
};

const subscriptionMockDataPassed = {
  resultcode: '01',
  body: {
    'Subscriber No': 253528815,
    'Smart Card No': '016600528067',
    status: ['INSTALLED'],
    'Status Date': '05-Dec-2014 02:01:20 PM',
    Packages: 'Flat RM 50 RC for EMP - Effective Date : 01-OCT-18',
    Account_Id: 86685253,
    DMT: 'SFH1CC1852012407',
    Paired: 'Hard Paired',
    StatusDate: '05-Dec-2014 02:01:20 PM',
    CampaignCode: 'UHD010RES',
    ARPU_BT: 50,
    ARPU_AT: 53,
    CommStartDate: '2019-12-10T00:00:00.000Z',
    CommEndDate: '2019-12-10T00:00:00.000Z',
    MinSubFee: '39.99',
    BouquetID: 'E0F1',
    'ISP Name': '',
    'Voice Service Indicator': '',
    BBAttributes: ''
  }
};

const subscriptionMockActiveStatus = {
  resultcode: '01',
  body: {
    status: 'ACTIVE'
  }
};

const subscriptionMockNoStatus = {
  resultcode: '01',
  body: {
    'Subscriber No': 253528815,
    'Smart Card No': '016600528067',
    status: [],
    'Status Date': '05-Dec-2014 02:01:20 PM',
    Packages: 'Flat RM 50 RC for EMP - Effective Date : 01-OCT-18',
    Account_Id: 86685253,
    DMT: 'SFH1CC1852012407',
    Paired: 'Hard Paired',
    StatusDate: '05-Dec-2014 02:01:20 PM',
    CampaignCode: 'UHD010RES',
    ARPU_BT: 50,
    ARPU_AT: 53,
    CommStartDate: '2019-12-10T00:00:00.000Z',
    CommEndDate: '2019-12-10T00:00:00.000Z',
    MinSubFee: '39.99',
    BouquetID: 'E0F1',
    'ISP Name': '',
    'Voice Service Indicator': '',
    BBAttributes: ''
  }
};

const subscriptionMockDataFailed = {
  resultcode: '05',
  body: 'Error'
};

const accountEntitlementMockDataPassed = {
  resultcode: '01',
  body: {
    data: {
      'Subscriber No': 253528815,
      'Smart Card No': '016600528067',
      Status: 'INSTALLED',
      'Status Date': '05-Dec-2014 02:01:20 PM',
      Packages: 'Flat RM 50 RC for EMP - Effective Date : 01-OCT-18',
      account_id: 86685253,
      DMT: 'SFH1CC1852012407',
      Paired: 'Hard Paired',
      StatusDate: '05-Dec-2014 02:01:20 PM',
      CampaignCode: 'UHD010RES',
      ARPU_BT: 50,
      ARPU_AT: 53,
      CommStartDate: '2019-12-10T00:00:00.000Z',
      CommEndDate: '2019-12-10T00:00:00.000Z',
      MinSubFee: '39.99',
      BouquetID: 'E0F1',
      'ISP Name': '',
      'Voice Service Indicator': '',
      BBAttributes: '',
      body: { PrimaryPhone: '0123456789' }
    }
  }
};

const accountEntitlementMockDataNoAccountId = {
  resultcode: '01',
  body: {
    data: {
      'Subscriber No': 253528815,
      'Smart Card No': '016600528067',
      Status: 'INSTALLED',
      'Status Date': '05-Dec-2014 02:01:20 PM',
      Packages: 'Flat RM 50 RC for EMP - Effective Date : 01-OCT-18',
      DMT: 'SFH1CC1852012407',
      Paired: 'Hard Paired',
      StatusDate: '05-Dec-2014 02:01:20 PM',
      CampaignCode: 'UHD010RES',
      ARPU_BT: 50,
      ARPU_AT: 53,
      CommStartDate: '2019-12-10T00:00:00.000Z',
      CommEndDate: '2019-12-10T00:00:00.000Z',
      MinSubFee: '39.99',
      BouquetID: 'E0F1',
      'ISP Name': '',
      'Voice Service Indicator': '',
      BBAttributes: '',
      body: { PrimaryPhone: '0123456789' }
    }
  }
};

const accountEntitlementMockDataFailed = {
  resultcode: '05',
  body: 'Error'
};

// const dPlusSubscriptionDetailsMockPassed = {
//   resultcode: '01',
//   body: [
//     { account_id: '12345' }
//   ]
// };

// const userDetails = {
//   body: {
//     userData: [
//       {
//         id: 1,
//         firstName: 'Super',
//         lastName: 'Admin',
//         username: 'superadmin',
//         email: 'akshay.thadani@valuelabs.com',
//         contactNumber: '6012312312',
//         business_unit: 'ALL',
//         business_unit_name: 'Super Admin BU',
//         roleId: 1,
//         roleType: 'superadmin',
//         roleName: 'Super Admin',
//         user_type: 'SUPER_ADMIN',
//         user_type_name: 'Super Admin',
//         parentUserId: null,
//         employeeId: null,
//         parentUserName: null,
//         agencyId: null,
//         agencyCode: '-',
//         agencyName: '-',
//         agencyPIC: null,
//         loginTime: null,
//         logoutTime: null,
//         enabled: 1,
//         status: 'CONFIRMED',
//         isActive: 1,
//         createdBy: 1,
//         notes: '-',
//         reportingManager: null,
//         reportingManagerEmail: null,
//         resourceType: null,
//         reportingLocation: null
//       }
//     ]
//   }
// };

// const usernameList = ['superadmin', 'akshay-admin'];
const tierBasedRewardMockData = {
  activeTierDays: 'xxxx',
  tierStartDisplayDate: 'xxxxxx',
  tier: 'xxxxx',
  tierDisplayName: 'xxxxxxxxxx'
};

module.exports = {
  subscriptionMockData,
  accountMockData,
  accountWinleadMockData,
  contactMockData,
  priceCalculatorInfo,
  accountInfoByEmail,
  interactionMockData,
  interactionWinleadMockData,
  pdpaMockData,
  caseHistoryMockData,
  caseFulfillmentOrderMockData,
  caseFulfillmentDetailsMockData,
  caseFlexibleAttributesMockData,
  caseDetailsInfoMockData,
  caseSubCaseMockData,
  auditLogsMockData,
  portalAccountMockData,
  ulmUnlinkingMockData,
  leadOrderDetailsMockData,
  orderDetailsMockResponse,
  subscriptionPackagePriceMockData,
  subscriptionPackageInfoMockData,
  leadOverviewMockData,
  leadAttachmentMockData,
  leadHistoryMockData,
  leadMockData,
  searchMockData,
  flashMessagesMockData,
  freePreviewMockData,
  winBackSummaryMockData,
  netFlixMockData,
  alertsMockData,
  priceCalculatorCatalogInfo,
  recoRecommendationsMockData,
  apgRpnMockData,
  campaignLogs,
  campaignHistory,
  activeDCACampaignHistory,
  downloadedCampaigns,
  enableCampaignMessage,
  uploadedCampaignMessage,
  agencyActivityUploadHistory,
  agencyCode,
  downloadedAgencyActivityFile,
  uploadAgencyActivityFile,
  bulkDownloadAgencyActivityZip,
  dcaUsersListPass,
  dcaUsersListFailed,
  ulmUnlinkPass,
  ulmUnlinkFailed,
  accountPassedMock,
  accountFailedMock,
  auditLogsMockDataFailed,
  contactPassedMock,
  contactFailedMock,
  flashMessagesPassed,
  flashMessagesFailed,
  netFlixPassedMockData,
  netFlixFailedMockData,
  pdpaPassedMockData,
  pdpaFailedMockData,
  priceCalculatorInfoPassed,
  priceCalculatorInfoFailed,
  priceCalculatorCatalogInfoPassed,
  priceCalculatorCatalogInfoFailed,
  packsBySmcPassed,
  packsBySmcFailed,
  searchMockDataPassed,
  searchMockDataFailed,
  freePreviewMockDataPassed,
  freePreviewMockDataFailed,
  subscriptionMockDataPassed,
  subscriptionMockDataFailed,
  subscriptionMockNoStatus,
  subscriptionMockActiveStatus,
  accountEntitlementMockDataPassed,
  accountEntitlementMockDataFailed,
  accountEntitlementMockDataNoAccountId,
  tierBasedRewardMockData
};
