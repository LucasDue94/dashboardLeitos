<?php
require_once 'connection.php';

$sql = "select s.DESCRICAO as setor,
       lei.LEITO as numero,
       case when lei.COD_PAC is not null then 'O'
           when exists(select 1 from LIMPEZA_LEITO where LEITO = lei.LEITO and DATA_HORA_ABERTURA = (select max(DATA_HORA_ABERTURA) from LIMPEZA_LEITO where LEITO = lei.LEITO) and STATUS_ATUAL in ('6', '8', '9')) then 'H'
           when exists(select 1 from LIMPEZA_LEITO where LEITO = lei.LEITO and DATA_HORA_ABERTURA = (select max(DATA_HORA_ABERTURA) from LIMPEZA_LEITO where LEITO = lei.LEITO) and STATUS_ATUAL = '5') then 'M'
           when exists(select 1 from RCINTCAD where LEITO = lei.LEITO and sysdate between to_date(to_char(DATA_INI, 'YYYY-MM-DD') || ' ' || to_char(HORA_INI, 'HH24:MI:SS'), 'YYYY-MM-DD HH24:MI:SS') and to_date(to_char(DATA_FIN, 'YYYY-MM-DD') || ' ' || to_char(HORA_FIN, 'HH24:MI:SS'), 'YYYY-MM-DD HH24:MI:SS')) THEN 'I'
           when exists(select 1 from RCRSVCAD where LEITO = lei.LEITO and TIPO_RSV = 'L' and sysdate between to_date(to_char(DATA_INICIAL, 'YYYY-MM-DD') || ' ' || to_char(HORA_INICIAL, 'HH24:MI:SS'), 'YYYY-MM-DD HH24:MI:SS') and to_date(to_char(DATA_FINAL, 'YYYY-MM-DD') || ' ' || to_char(HORA_FINAL, 'HH24:MI:SS'), 'YYYY-MM-DD HH24:MI:SS')) then 'R'
       else 'L' end as status
from FALEICAD lei
    inner join FAAPTCAD apt on apt.COD_APT = lei.COD_APT
    inner join FASETCAD s on s.COD_SET = apt.COD_SET
    inner join FACELCAD cel on cel.COD_CEL = s.COD_CEL
where lei.DESATIVADO is null
  and cel.COD_UNIDADE = '0001'
  and lei.TIPO <> 'VT'
order by setor, leito";

$con = con();
$statement = oci_parse($con, $sql);
oci_execute($statement);
oci_fetch_all($statement, $leitos, 0, -1, OCI_FETCHSTATEMENT_BY_ROW | OCI_ASSOC);
header('content-type: application/json');
$arrayLower = array_change_key_case($leitos, CASE_LOWER);
echo json_encode($arrayLower);