<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case OWNER_CAFFE = 'owner_caffe';
    case CASHIER = 'cashier';
    case VISITOR = 'visitor';
}