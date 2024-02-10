// RNL DB

exports.subDemoDCAQuery = () => {
  return `SELECT
  s.subscriber_no as "Subscriber No",
  s.prim_resource_val as "Smart Card No" ,
  CASE WHEN  s.sub_status='A' THEN 'INSTALLED'
      WHEN  s.sub_status='C' THEN 'DEINSTALLED'
      WHEN  s.sub_status='D' THEN 'SUSPENDED (NON PAYMENT)'
      WHEN  s.sub_status='U' THEN 'SUSPENDED (NON PAYMENT)'
      WHEN  s.sub_status='S' THEN 'SUSPENDED (VOLUNTARY)' ELSE '-' END as "Status",
  REPLACE(TO_CHAR(sub_status_date,'dd-Mon-yyyy hh:mi:ss AM'),'12:00:00 AM','') as "Status Date",
  (SELECT RTRIM( xmlagg (xmlelement (c,  description||' - Effective Date : '||effective_date|| ',')
  ORDER BY description||' - Effective Date : '||effective_date).extract ('//text()'), ',' )  pkg
  FROM bl1_rc_rates rc,bl1_charge_code c
  WHERE service_receiver_id= s.subscriber_no
  AND receiver_customer=s.customer_id
  AND rc.CUSTOMER_KEY=mod(rc.RECEIVER_CUSTOMER,100)
  AND c.charge_code=rc.charge_code
  AND NVL(expiration_date,SYSDATE+1)>SYSDATE) "Packages"
  FROM ar1_account ac, subscriber s
  WHERE ac.account_id=:account_id
  AND s.customer_id=ac.customer_no
  AND s.sub_status<>'C'
  ORDER BY  s.prim_resource_val desc`;
};
exports.subDemoQuery = () => {
  return `SELECT
  s.subscriber_no as "Subscriber No",
  s.prim_resource_val as "Smart Card No" ,
  CASE WHEN  s.sub_status='A' THEN 'INSTALLED'
      WHEN  s.sub_status='C' THEN 'DEINSTALLED'
      WHEN  s.sub_status='D' THEN 'SUSPENDED (NON PAYMENT)'
      WHEN  s.sub_status='U' THEN 'SUSPENDED (NON PAYMENT)'
      WHEN  s.sub_status='S' THEN 'SUSPENDED (VOLUNTARY)' ELSE '-' END as "Status",
  REPLACE(TO_CHAR(sub_status_date,'dd-Mon-yyyy hh:mi:ss AM'),'12:00:00 AM','') as "Status Date",
  (SELECT RTRIM( xmlagg (xmlelement (c,  description||' - Effective Date : '||effective_date|| ',')
  ORDER BY description||' - Effective Date : '||effective_date).extract ('//text()'), ',' )  pkg
  FROM bl1_rc_rates rc,bl1_charge_code c
  WHERE service_receiver_id= s.subscriber_no
  AND receiver_customer=s.customer_id
  AND rc.CUSTOMER_KEY=mod(rc.RECEIVER_CUSTOMER,100)
  AND c.charge_code=rc.charge_code
  AND NVL(expiration_date,SYSDATE+1)>SYSDATE) "Packages"
  FROM ar1_account ac, subscriber s
  WHERE ac.account_id=:account_id
  AND s.customer_id=ac.customer_no
  AND s.sub_status<>'C'
  ORDER BY  s.prim_resource_val desc`;
};

// OMS DB
exports.primarySubscriptionQuery = () => {
  const query = `select distinct  ap_id, case when tb.l9_primary_ap_id is null then 'TRUE' else
    case when get_attr_value((tb.item_atrs_list),'PrimarySubscription')='Yes' then 'TRUE' else 'FALSE' end
    end as "Primary Subscription"
    from   tbap_item tb, ar1_account@omssel2abp ac, subscriber@omssel2abp sc
    where  tb.service_id=:smcNumber
    and    tb.customer_id=to_char(ac.customer_no)
    and    sc.subscriber_no=tb.subscriber_id
    and    sc.customer_id=ac.customer_no
    and    tb.state='AS'
    and    tb.end_date>sysdate
    and    tb.main_ind='1'
    and    tb.subscriber_id is not null
    and    sc.sub_status<>'C'`;
  return query;
};

// OMS DB
exports.subscriptionBouquetQuery = () => {
  const query = `SELECT CASE 
                            WHEN BouquetID = 'E0E2' THEN '2.0'
                            WHEN BouquetID = 'E0E0' THEN '1.0'
                            WHEN BouquetID = 'E0E5' THEN '1.5'
                            WHEN BouquetID = 'E0E4 - IPTV' THEN '4.0'
                            WHEN BouquetID = 'E0E7' THEN 'Jaguh'
                          ELSE '' END 
                          "Bouquet ID" FROM (select
                          Case WHEN INSTR(item_atrs_list, 'BouquetID+') > 0 THEN
                          SUBSTR(TO_CHAR(item_atrs_list), INSTR(item_atrs_list, 'BouquetID+' , 1, 1)+10, INSTR(item_atrs_list, ';' , INSTR(item_atrs_list, 'BouquetID+' , 1, 1)+10, 1)-(INSTR(item_atrs_list, 'BouquetID+' , 1, 1)+10))
                          ELSE '' END 
                          BouquetID
                          from (
                            select main_item_id,ap_version_id*1 ap_version_id, item_atrs_list,
                            max(ap_version_id) over ( partition by main_item_id,item_def_id) RNK
                            from tbap_item where service_id = :smcNumber and service_type = 'SMC' and item_def_id = '921'
                          )ac where ac.ap_version_id = RNK) TEST`;
  return query;
};

// OMS DB
exports.provideDateSubscriptionQuery = () => {
  const query = `SELECT REPLACE(TO_CHAR(start_date,'dd-Mon-yyyy hh:mi:ss AM'),'12:00:00 AM','') "Provide Date"
                   FROM tbap_item WHERE service_id=:smcNumber
                   AND service_type='TVMC' AND state != 'CA' AND action_type IN ('PR')`;
  return query;
};

// OMS DB
exports.rgDateSubscriptionQuery = () => {
  const query = `SELECT REPLACE(TO_CHAR(start_date,'dd-Mon-yyyy hh:mi:ss AM'),'12:00:00 AM','') "RG Date"
                   FROM tbap_item WHERE service_id=:smcNumber
                   AND service_type='TVMC' AND state != 'CA' AND action_type IN ('RG')`;
  return query;
};

// OMS DB
exports.getApIdBySmcNumberQuery = (smcNo) => {
  const query = `select ap_id from tbap_item where service_id='${smcNo}' 
    and end_date > TO_DATE('11/08/2030 00:10:00', 'MM/DD/YYYY HH24:MI:SS') and 
    state = 'AS' and main_ind='1' and status = 'AC'`;
  return query;
};
// RNL DB
exports.winleadSubscriptionInfoQuery = () => {
  const query = `SELECT ac.account_id, s.sub_status_date, s.subscriber_no, s.prim_resource_val "SmartcardNumber", sp.part_status "SubscriptionStatus", s.L9_DECODER_SERIAL_NO "DMT", sp.X_PAIRED "Paired",
 (SELECT RTRIM( xmlagg (xmlelement (c, description)
      ORDER BY description).extract ('//text()'), '' ) pkg
      FROM bl1_rc_rates rc,bl1_charge_code c
      WHERE service_receiver_id= s.subscriber_no
      AND receiver_customer=s.customer_id
      AND c.charge_code=rc.charge_code
      AND NVL(expiration_date,SYSDATE+1)>SYSDATE) "OfferName",REPLACE(TO_CHAR(sub_status_date,'dd-Mon-yyyy hh:mi:ss AM'),'12:00:00 AM','') "StatusDate",
      sp.x_campaign_code "CampaignCode"     
      FROM ar1_account ac, subscriber s, table_site_part@bill_to_crm sp
      WHERE ac.account_id=:account_id AND s.customer_id=ac.customer_no AND sp.s_instance_id=TO_CHAR(s.subscriber_no)
      ORDER BY sp.part_status DESC, sp.install_date DESC, s.prim_resource_val ASC`;
  return query;
};

// OMS DB
exports.DCASubscriptionDetailsQuery = () => {
  const query = `select a.*,
add_months(TO_DATE(NVL(substr(GET_ATTR_VALUE(ITEM_ATRS_LIST, 'CommitmentEndDate'),1,10),to_char(sysdate,'dd/mm/yyyy')),'dd/mm/yyyy'), - NVL(GET_ATTR_VALUE(ITEM_ATRS_LIST, 'CommitmentPeriod'),0)) commstartdate,
TO_DATE(NVL(substr(GET_ATTR_VALUE(ITEM_ATRS_LIST, 'CommitmentEndDate'),1,10),to_char(sysdate,'dd/mm/yyyy')),'dd/mm/yyyy') commenddate,
NVL(GET_ATTR_VALUE(ITEM_ATRS_LIST, 'MinimumSubscrpitionFee'),0) minSubFee,
(select distinct subscriber_id from tbap_item x where x.main_item_id=a.main_item_id and x.service_type='TVMC' and x.end_date>sysdate ) Subscriber_no
from (select service_id,main_item_id,GET_ATTR_VALUE(ITEM_ATRS_LIST, 'BouquetID') BouquetID from tbap_item
where service_id=:smc_no
and service_type='SMC' and state='AS' and end_date>sysdate) a,
tbap_item ti
where ti.main_item_id=a.main_item_id
and service_type='COMM'
and state='AS' and end_date>sysdate and status='AC' and rownum<2 order by commenddate desc`;
  return query;
};
exports.winleadSubscriptionDetailsQuery = () => {
  const query = `select a.*,
add_months(TO_DATE(NVL(substr(GET_ATTR_VALUE(ITEM_ATRS_LIST, 'CommitmentEndDate'),1,10),to_char(sysdate,'dd/mm/yyyy')),'dd/mm/yyyy'), - NVL(GET_ATTR_VALUE(ITEM_ATRS_LIST, 'CommitmentPeriod'),0)) commstartdate,
TO_DATE(NVL(substr(GET_ATTR_VALUE(ITEM_ATRS_LIST, 'CommitmentEndDate'),1,10),to_char(sysdate,'dd/mm/yyyy')),'dd/mm/yyyy') commenddate,
NVL(GET_ATTR_VALUE(ITEM_ATRS_LIST, 'MinimumSubscrpitionFee'),0) minSubFee,
(select distinct subscriber_id from tbap_item x where x.main_item_id=a.main_item_id and x.service_type='TVMC' and x.end_date>sysdate ) Subscriber_no
from (select service_id,main_item_id,GET_ATTR_VALUE(ITEM_ATRS_LIST, 'BouquetID') BouquetID from tbap_item
where service_id=:smc_no
and service_type='SMC' and state='AS' and end_date>sysdate) a,
tbap_item ti
where ti.main_item_id=a.main_item_id
and service_type='COMM'
and state='AS' and end_date>sysdate and status='AC' and rownum<2 order by commenddate desc`;
  return query;
};
// RNL DB (To fetch winlead arpu before tax , after tax values when status is active)
exports.DCAArpuBTAtQueryActive = () => {
  const query = `select sum(rc.amount) ARPU_BT, 
  CASE  when sum(rc.amount) > 0 then sum(rc.amount) + sum(rc.amount)*.06 else 0 end ARPU_AT 
  from bl1_rc_rates rc 
  where rc.service_receiver_id=:SUBSCRIBER_NO 
  and nvl(rc.expiration_date,sysdate+1) > sysdate`;
  return query;
};

exports.winleadArpuBTAtQueryActive = () => {
  const query = `select sum(rc.amount) ARPU_BT, 
  CASE  when sum(rc.amount) > 0 then sum(rc.amount) + sum(rc.amount)*.06 else 0 end ARPU_AT 
  from bl1_rc_rates rc 
  where rc.service_receiver_id=:SUBSCRIBER_NO 
  and nvl(rc.expiration_date,sysdate+1) > sysdate`;
  return query;
};
// RNL DB (To fetch winlead arpu before tax , after tax values when status is other than active)

exports.DCAArpuBTAtQueryNotActive = () => {
  const query = `select sum(aa.amount) ARPU_BT,CASE  when sum(aa.amount) > 0 then sum(aa.amount) + sum(aa.amount)*.06 else 0 end ARPU_AT  from (
        select dense_rank() over ( partition by rc.service_receiver_id,rc.charge_code order by rc.expiration_date desc) RNK, rc.* from bl1_rc_rates rc 
        where rc.service_receiver_id=:SUBSCRIBER_NO
        and rc.amount <> 0
        and rc.effective_date <= rc.expiration_date) aa
        where RNK =1`;
  return query;
};
exports.winleadArpuBTAtQueryNotActive = () => {
  const query = `select sum(aa.amount) ARPU_BT,CASE  when sum(aa.amount) > 0 then sum(aa.amount) + sum(aa.amount)*.06 else 0 end ARPU_AT  from (
        select dense_rank() over ( partition by rc.service_receiver_id,rc.charge_code order by rc.expiration_date desc) RNK, rc.* from bl1_rc_rates rc 
        where rc.service_receiver_id=:SUBSCRIBER_NO
        and rc.amount <> 0
        and rc.effective_date <= rc.expiration_date) aa
        where RNK =1`;
  return query;
};
// OMS DB
exports.DCABroadBandDetails = () => {
  const query = `select get_attr_value(ITEM_ATRS_LIST,'IPTV_SERVICE_PROVIDER') ISPName,
  get_attr_value(ITEM_ATRS_LIST,'Voice_Service_ind') VoiceService,
          'Cable_type : ' || get_attr_value(ITEM_ATRS_LIST,'Cable_type') || ' + ' ||
         'IPTV_SERVICE_PROVIDER : ' || get_attr_value(ITEM_ATRS_LIST,'IPTV_SERVICE_PROVIDER')  || ' + ' ||
         'Preferred_LoginName_1 : ' || get_attr_value(ITEM_ATRS_LIST,'Preferred_LoginName_1')  || ' + ' ||
         'Public_IP_Ind : ' || get_attr_value(ITEM_ATRS_LIST,'Public_IP_Ind')  || ' + ' BBAttributes
  from   TBAP_ITEM ti
  where  MAIN_ITEM_ID in (select  MAIN_ITEM_ID
                      from   TBAP_ITEM ti
                      where  ti.service_id=:smc_no
                      and    ti.main_ind=1
                      and    ti.state = 'AS')
  and   service_type='BROD'
  and   ti.STATE='AS'
  and   end_date>=SYSDATE`;
  return query;
};
exports.winleadBroadBandDetails = () => {
  const query = `select get_attr_value(ITEM_ATRS_LIST,'IPTV_SERVICE_PROVIDER') ISPName,
  get_attr_value(ITEM_ATRS_LIST,'Voice_Service_ind') VoiceService,
          'Cable_type : ' || get_attr_value(ITEM_ATRS_LIST,'Cable_type') || ' + ' ||
         'IPTV_SERVICE_PROVIDER : ' || get_attr_value(ITEM_ATRS_LIST,'IPTV_SERVICE_PROVIDER')  || ' + ' ||
         'Preferred_LoginName_1 : ' || get_attr_value(ITEM_ATRS_LIST,'Preferred_LoginName_1')  || ' + ' ||
         'Public_IP_Ind : ' || get_attr_value(ITEM_ATRS_LIST,'Public_IP_Ind')  || ' + ' BBAttributes
  from   TBAP_ITEM ti
  where  MAIN_ITEM_ID in (select  MAIN_ITEM_ID
                      from   TBAP_ITEM ti
                      where  ti.service_id=:smc_no
                      and    ti.main_ind=1
                      and    ti.state = 'AS')
  and   service_type='BROD'
  and   ti.STATE='AS'
  and   end_date>=SYSDATE`;
  return query;
};
// CRM DB
exports.DCADmtDetails = () => {
  const query = `SELECT ac.account_id "Account_Id",
s.L9_DECODER_SERIAL_NO "DMT", sp.X_PAIRED "Paired",  s.prim_resource_val as "Smart Card No" ,
REPLACE(TO_CHAR(sub_status_date,'dd-Mon-yyyy hh:mi:ss AM'),'12:00:00 AM','') "StatusDate",
      sp.x_campaign_code "CampaignCode"
      FROM ar1_account@CRMSEL2ABPSEL ac, subscriber@CRMSEL2ABPSEL s, table_site_part sp
      WHERE ac.account_id=:account_id AND s.customer_id=ac.customer_no AND sp.s_instance_id=TO_CHAR(s.subscriber_no)
      ORDER BY sp.part_status DESC, sp.install_date DESC, s.prim_resource_val ASC`;
  return query;
};
exports.winleadDmtDetails = () => {
  const query = `SELECT ac.account_id "Account_Id",
s.L9_DECODER_SERIAL_NO "DMT", sp.X_PAIRED "Paired",  s.prim_resource_val as "Smart Card No" ,
REPLACE(TO_CHAR(sub_status_date,'dd-Mon-yyyy hh:mi:ss AM'),'12:00:00 AM','') "StatusDate",
      sp.x_campaign_code "CampaignCode"
      FROM ar1_account@CRMSEL2ABPSEL ac, subscriber@CRMSEL2ABPSEL s, table_site_part sp
      WHERE ac.account_id=:account_id AND s.customer_id=ac.customer_no AND sp.s_instance_id=TO_CHAR(s.subscriber_no)
      ORDER BY sp.part_status DESC, sp.install_date DESC, s.prim_resource_val ASC`;
  return query;
};
