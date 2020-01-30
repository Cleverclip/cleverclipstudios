<?php

require_once 'mobile-detect.php';

$detect = new Mobile_Detect;

$context['isPhone'] = $detect->isPhone() && !$detect->isTablet();
$context['isTablet'] = $detect->isTablet();
$context['isDesktop'] = !$detect->isPhone() && !$detect->isTablet();
