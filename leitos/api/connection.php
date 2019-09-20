<?php

function con()
{
    $con = false;
    try {
        $connection_string = '(DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = 10.10.1.20)(PORT = 1521))) (CONNECT_DATA = (SERVICE_NAME = PROD)))';
        $con = oci_connect('admwpd', 'admwpd', $connection_string);
    } catch (Exception $exception) {
        echo $exception->getMessage();
    }
    return $con;
}