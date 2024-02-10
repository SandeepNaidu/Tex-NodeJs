exports.disconnectReconnectHistoryQuery = () => {
  return `
    select S.PRIM_RESOURCE_VAL SMC,case when S.SUB_STATUS='A' then 'RECONNECT' else 'DISCONNECT' end OrderType,
    S.SUB_STATUS_DATE requireDate
    from  AR1_ACCOUNT AC, SUBSCRIBER_HISTORY S, SUBSCRIBER S1
    where ACCOUNT_ID=:account_id
    and   AC.CUSTOMER_NO=S1.CUSTOMER_ID
    and   S.SUBSCRIBER_NO=S1.SUBSCRIBER_NO 
    union all
    select S.PRIM_RESOURCE_VAL SMC,case when S.SUB_STATUS='A' then 'RECONNECT' else 'DISCONNECT' end OrderType, S.SUB_STATUS_DATE requireDate
    from  AR1_ACCOUNT AC, SUBSCRIBER S
    where ACCOUNT_ID=:account_id
    and   AC.CUSTOMER_NO=S.CUSTOMER_ID order by requireDate desc
    `;
};
