### [Módulo: Admin Dashboard Notifications]

**POST /adminDashboard/notifications/{userId}**  
(Obtiene el listado de notificaciones para un usuario específico)

**Params:** `id` (ID del usuario)

**Body (FormData):** 
- `userRoleId` (string, requerido)
- `page` (string, opcional, default: '1')
- `limit` (string, opcional, default: '10')
- `typeId` (string, opcional)

**200:** 
```json
{
  "notifications": [
    {
      "id", "user_id", "title", "content", "is_read", "created_at", ...
      "customers": { "first_name", "last_name", "id", "email" },
      "user": { "name", "last_name", "id", "email" },
      "unregistered_customer": { "mobile_phone_number" }
    }
  ],
  "pagination": { "page", "limit", "total", "hasMore" }
}
```

**422:** `{ fieldErrors: { userRoleId: [ ... ] } }`

**500:** `{ serverError: 'Server Error' }`

---

**PUT /adminDashboard/notifications/{id}**  
(Actualiza el estado de lectura de una notificación)

**Params:** `id` (ID de la notificación)

**Body (FormData):** 
- `option` ("read" para marcar como leída, cualquier otro valor para no leída)

**200:** `{ successMessage: 'Notification Successfully Changed' }`

**422:** `{ fieldErrors: { option: [ ... ] } }`

**500:** `{ serverError: 'Server Error' }`

---

**DELETE /adminDashboard/notifications/{id}**  
(Elimina una notificación)

**Params:** `id` (ID de la notificación)

**200:** `{ successMessage: 'Notification Successfully Deleted' }`

**500:** `{ serverError: 'Server Error' }`

---

### [Módulo: Admin Dashboard Clients]

**GET /adminDashboard/clients**  
(Obtiene el listado general de todos los clientes registrados)

**200:**
```json
[
  {
    "id", "name_lastname", "email", "mobile_phone", "home_phone", "work_phone",
    "born_date", "created_at", "consent_approved", "last_activity",
    "client_status": { "id", "status" },
    "seller": { "id", "name", "last_name", "email" },
    "client_address": { "street", "city", "state", ... },
    "interested_vehicle": { ... },
    "appointment": [ ... ],
    "note": [ ... ]
  }
]
```

**500:** `{ serverError: 'Server Error' }`

---

**POST /adminDashboard/clients**  
(Crea un nuevo cliente en el sistema)

**Permissions:** 31 (Customer Creation)

**Body (FormData):** 
- `name_lastname` (string, requerido)
- `first_name` (string, requerido)
- `last_name` (string, requerido)
- `phone_number` (string, requerido, 10 dígitos)
- `home_phone_number` (string, opcional)
- `work_phone_number` (string, opcional)
- `email` (string, opcional)
- `born_date` (string, opcional, "YYYY-MM-DD")
- `current_address` (string, requerido - requiere Street, City, State separados por coma)
- `lead_type` (string, requerido)
- `lead_source` (string, opcional - ID del lead source) o `leadSourceName` (string, opcional - nombre para búsqueda/creación)
- `type_of_client` (string, requerido)
- `created_by` (string, requerido - ID del usuario)
- `social_security` (string, opcional)
- `salutation`, `middle_initials`, `nickname`, `suffix` (string, opcional)

**200:** 
```json
{
  "successMessage": "Client Successfully Created",
  "data": {
    "customer": { "id", "first_name", "last_name", "email", ... },
    "change": "boolean (indica si se creó un nuevo lead source)"
  }
}
```

**422:** `{ fieldErrors: { email: [...], phone_number: [...], current_address: [...] } }`

**500:** `{ serverError: 'Server Error' }`

---

**GET /adminDashboard/clients/{statusId}**  
(Obtiene clientes filtrados por un ID de estado específico y diversos filtros de fecha)

**Params:** `id` (ID del estado del cliente, ej: 1=New, 10=Sold, etc.)

**Query Params:**
- `timeZone` (string, opcional)
- `optionDefaultDate`, `fromDefaultDate`, `toDefaultDate` (Fecha de creación)
- `optionActivityDate`, `fromActivityDate`, `toActivityDate` (Fecha de última actividad)
- `optionVisitDate`, `fromVisitDate`, `toVisitDate` (Fecha de visitas)
- `optionDepositDate`, `fromDepositDate`, `toDepositDate` (Fecha de depósitos)
- `optionLostDate`, `fromLostDate`, `toLostDate` (Fecha de pérdida)
- `optionSoldDate`, `fromSoldDate`, `toSoldDate` (Fecha de venta)
- `optionDeliveryDate`, `fromDeliveryDate`, `toDeliveryDate` (Fecha de entrega)
- `optionDaysInDate`, `fromDaysInDate`, `toDaysInDate` (Fecha de permanencia en estado)
- `lostReasonId` (string, IDs de razones de pérdida separados por coma)

**200:** Array de objetos `client` con relaciones detalladas (vehicle, deal, lead, etc.). Si el estado es 10 (Sold), los datos se devuelven ordenados por fecha de venta.

**500:** `{ serverError: 'Server Error' }`

---

**POST /adminDashboard/clients/by-filters**  
(Búsqueda avanzada de clientes aplicando filtros dinámicos configurables)

**Query Params:**
- `timeZone` (string, opcional)
- `optionDate`, `fromDate`, `toDate` (Fecha de creación de relación usuario-cliente)
- `optionDefaultDate`, `fromDefaultDate`, `toDefaultDate` (Fecha de creación del registro)
- `userId` (string, ID del usuario para filtrar clientes relacionados)
- `excludeClientStatus` (string, IDs de estado a excluir separados por coma)

**Body (JSON):**
- `filters`: `[ { "id": string, "value": any, "operator": string, "category": string }, ... ]`

**200:** Array de objetos `client` con relaciones.

**500:** `{ serverError: 'Server Error' }`

---

**POST /dashboardSearch**  
(Busca clientes por nombre, apellido, email, teléfono, marca/modelo de vehículo interesado o stock No)

**Body (FormData):**
- `param` (string, requerido): El término de búsqueda.

**200:**
```json
[
  {
    "id": 1,
    "first_name": "string",
    "last_name": "string",
    "mobile_phone": "string",
    "email": "string",
    "lead": [
      {
        "sales_rep_id": 1,
        "bdc_id": 1,
        "customer_status": {
          "id": 1,
          "status": "string"
        },
        "customer_funding_list_status_id": 1
      }
    ]
  }
]
```

**422:** `{ fieldErrors: { param: [...] } }`

**500:** `{ serverError: 'Server Error' }`


---

### [Módulo: Admin Dashboard Clients Notes]

**GET /adminDashboard/clientsNotes**  
(Obtiene el listado general de todas las notas registradas)

**200:**
```json
[
  {
    "id", "note", "created_at", "client_id",
    "created_by": { "id", "name", "last_name", "email" },
    "from": { "id", "from" }
  }
]
```

**500:** `{ serverError: 'Server Error' }`

---

**POST /adminDashboard/clientsNotes**  
(Crea una nueva nota para un cliente específico)

**Permissions:** 20

**Body (FormData):** 
- `note` (string, requerido)
- `created_by` (string, requerido - ID del usuario)
- `client_id` (string, requerido - ID del cliente)
- `from` (string, opcional - ID del origen de la nota)
- `today` (string, requerido - fecha para el registro del evento)

**200:** 
```json
{
  "successMessage": "Note Created",
  "data": { "id", "note", "created_at", "client_id", ... }
}
```

**422:** `{ fieldError: { note: [...], client_id: [...], ... } }`

**500:** `{ serverError: 'Server Error' }`

---

**GET /adminDashboard/clientsNotes/{customerStatusId}**  
(Obtiene todas las notas de clientes que pertenecen a un estado específico)

**Params:** `customerStatusId` (ID del estado del cliente)

**200:** Array de objetos `note` (misma estructura que el listado general).

**500:** `{ serverError: 'Server Error' }`

---

### [Módulo: Admin Dashboard Client Detail Leads]

**GET /adminDashboard/clientDetailLeads**  
(Obtiene el catálogo de tipos específicos de leads/detalles de leads)

**200:** 
```json
[
  {
    "id": 1,
    "lead": "string"
  }
]
```

**500:** `{ serverError: 'Server Error' }`

---

### [Módulo: Admin Dashboard Client Statuses]

**GET /adminDashboard/clientStatuses**  
(Obtiene el catálogo de estados de los clientes)

**200:** 
```json
[
  {
    "id": 1,
    "status": "string"
  }
]
```

**500:** `{ serverError: 'Server Error' }`

---

### [Módulo: Admin Dashboard Client Types]

**GET /adminDashboard/clientTypes**  
(Obtiene el catálogo de tipos de clientes conforme a su origen o perfil)

**200:** 
```json
[
  {
    "id": 1,
    "type": "string"
  }
]
```

**500:** `{ "message": "error_message" }`

---

### [Módulo: Admin Dashboard Client Vehicle]

**POST /adminDashboard/clientVehicle**  
(Crea un registro de Trade-in para un vehículo de un cliente)

**Body (FormData):**
- `tradein` (any, requerido para activar lógica de trade-in)
- `vinInput` (string, requerido)
- `tradeinVehicleYearInput` (string, requerido)
- `tradeinVehicleMakeInput` (string, requerido)
- `tradeinVehicleModelInput` (string, requerido)
- `tradeinVehicleTrimInput` (string, requerido)
- `vehicleTradeinMileageInput` (string, requerido)
- `vehicleTradeinInteriorColorInput` (string, requerido - ID)
- `vehicleTradeinExteriorColorInput` (string, requerido - ID)
- `tradeinVehicleTypeInput` (string, requerido - ID)
- `client_id` (string, requerido)
- `tradeinCommentInput` (string, opcional)
- `tradeinBookInput` (string, opcional)
- `tradeinAllowanceInput` (string, opcional)
- `tradeinPayoffInput` (string, opcional)

**200:** `{ successMessage: 'Traede in created' }`

**422:** `{ fieldErrors: { vinInput: [...], ... } }`

**500:** `{ serverError: 'Server Error' }`

---

**PUT /adminDashboard/clientVehicle/{id}**  
(Actualiza un registro de Trade-in existente)

**Params:** `id` (ID del registro de trade-in)

**Body (FormData):**
- `tradein` (any, requerido para activar lógica de trade-in)
- `client_id` (string, requerido)
- (Mismos campos que el POST: `vinInput`, `tradeinVehicleYearInput`, etc.)

**200:** `{ successMessage: 'Traede in updated' }`

**422:** `{ fieldErrors: { ... } }`

**500:** `{ serverError: 'Server Error' }`

---

### [Módulo: Admin Dashboard Users]

**GET /adminDashboard/users** 
(Obtiene el listado de todos los usuarios activos)

**200:**
```json
[
  {
    "id": 1,
    "email": "string",
    "name": "string",
    "last_name": "string",
    "username": "string",
    "created_at": "date-time",
    "updated_at": "date-time",
    "mobile_phone": "string",
    "img": "string (url)",
    "status_id": 1,
    "round_robin": true,
    "ready_for_leads": false,
    "round_robin_order": 1,
    "monthly_vehicle_sales_goal": 10,
    "sales_points_total": 100,
    "sales_points_today": 5,
    "daily_points_target": 10,
    "users_status": { "status": "string" },
    "user_has": [
      {
        "role": { "role": "string", "id": 1 }
      }
    ]
  }
]
```

**500:** `{ serverError: 'Server Error' }`

---

**POST /adminDashboard/users**
(Crea un nuevo usuario o reactiva uno eliminado)

**Permissions:** 32

**Body (FormData):**
- `firstName` (string, requerido)
- `lastName` (string, requerido)
- `role` (string, requerido - ID)
- `mobilePhone` (string, requerido)
- `email` (string, requerido)
- `username` (string, requerido)
- `password` (string, requerido - min 8 chars, 1 mayus, 1 especial, 1 num)
- `userImage` (File, opcional)

**200:** 
- `{ successMessage: 'User Successfully Created' }`
- `{ successMessage: 'User Successfully Reactivated' }`

**422:** 
```json
{
  "fieldErrors": {
    "email": ["Email already exists"],
    "username": ["Username already exists"],
    "password": ["The password must contain..."]
  }
}
```

**500:** `{ serverError: 'Server Error' }`

---

**GET /adminDashboard/users/{id}**
(Obtiene el detalle completo de un usuario específico)

**200:**
```json
{
  "id": 1,
  "email": "string",
  "name": "string",
  "last_name": "string",
  "username": "string",
  "created_at": "date-time",
  "updated_at": "date-time",
  "mobile_phone": "string",
  "img": "string (url)",
  "status_id": 1,
  "monthly_vehicle_sales_goal": 10,
  "sales_points_total": 100,
  "sales_points_today": 5,
  "users_status": { "status": "string" },
  "user_has": [
    {
      "role": { "role": "string", "id": 1 }
    }
  ],
  "pay_plan": {
    "id": 1,
    "user_id": 1,
    "pay_type": "string",
    "front_gross": "decimal",
    "back_gross": "decimal",
    "of_cash_down": "decimal",
    "sales_person_id": "string",
    "exclude_reserve_or_flat": false
  }
}
```

**500:** `{ serverError: 'Server Error' }`

---

**PUT /adminDashboard/users/{id}**
(Actualiza la información del usuario, horario y plan de pago)

**Permissions:** 34 o 39

**Body (FormData):**
- `firstName`, `lastName`, `role`, `email`, `mobilePhone` (requeridos)
- `username`, `password` (opcional)
- `dayweek` (string JSON array, ej: "[true,true,true,true,true,false,false]")
- `daytimeFrom`, `daytimeTo` (string JSON array)
- `userScheduleData` (string JSON array de IDs existentes)
- `pay_plan_type`, `pay_plan_data` (string, opcional)
- `monthlyVehicleSalesGoal` (number, opcional)
- `userImage` (File, opcional)

**200:** `{ successMessage: 'User Successfully Updated' }`

**422:** `{ fieldErrors: { ... } }`

**500:** `{ serverError: 'Server Error' }`

---

**DELETE /adminDashboard/users/{id}**
(Elimina lógicamente a un usuario)

**Permissions:** 35

**200:** `{ successMessage: 'User Successfully Deleted' }`

**500:** `{ serverError: 'Server Error' }`

---

**PUT /adminDashboard/users/{id}/dailyPointsTarget**
(Actualiza la meta diaria de puntos del usuario)

**Body (FormData):**
- `daily_target` (number)

**200:** Objeto `user` completo con los datos actualizados de Prisma.

**500:** `{ serverError: 'Error updating daily target' }`

---

**GET /adminDashboard/userSchedule/{id}**
(Obtiene el horario detallado de un usuario específico)

**Params:** `id` (ID del usuario)

**200:**
```json
[
  {
    "id": 1,
    "dayweek_id": 1,
    "from_day_times_id": 1,
    "to_day_times_id": 1,
    "user_id": 1,
    "active": true
  }
]
```

**500:** `{ serverError: 'Server Error' }`

---

**GET /adminDashboard/userStatus**
(Obtiene el catálogo de estados disponibles para los usuarios)

**200:**
```json
[
  {
    "id": 1,
    "status": "string"
  }
]
```

**500:** `{ serverError: 'Server Error' }`

---

**PUT /adminDashboard/userStatus/{id}**
(Cambia el estado de un usuario - activa/desactiva)

**Params:** `id` (ID del usuario)

**Permissions:** 41

**Body (FormData):**
- `status` (string, requerido - ID del nuevo estado)

**200:** `{ successMessage: 'Status Successfully Changed' }`

**422:** `{ fieldsError: { status: [...] } }`

**500:** `{ serverError: 'Server Error' }`

---

**DELETE /adminDashboard/userStatus/{id}**
(Elimina permanentemente un registro de usuario de la base de datos)

**Params:** `id` (ID del usuario)

**Permissions:** 42

**200:** `{ successMessage: 'Status Successfully Deleted' }`

**500:** `{ serverError: 'Server Error' }`

---

### [Módulo: Inventario]

**GET /inventory/vehicle?excludeSold=true**
(Obtiene el listado general de vehículos, opcionalmente excluyendo los vendidos)

**Query Params:** `excludeSold=true` (opcional)

**200:**
```json
[
  {
    "id": 1,
    "stock_no": "string",
    "cylinder": "string",
    "doors": "string",
    "gvw": "string",
    "hwy": "string",
    "motor": "string",
    "mpg_city": "string",
    "odometer": "string",
    "odometer_make_id": 1,
    "weight": "string",
    "body_type_id": 1,
    "condition_id": 1,
    "drive_train_id": 1,
    "engine_id": 1,
    "customer_status": "string",
    "exterior_color_id": 1,
    "fuel_tank_type_id": 1,
    "identification_id": 1,
    "image_id": 1,
    "interior_color_id": 1,
    "make_id": 1,
    "model_id": 1,
    "entry_stock": "date-time",
    "transmission_id": 1,
    "trim_id": 1,
    "vehicle_status_id": 1,
    "vehicle_type_id": 1,
    "manufacture_year_id": 1,
    "key_info_id": 1,
    "title_license_id": 1,
    "vehicle_general_info_id": 1,
    "vehicle_purchase_info_id": 1,
    "general_info": {
      "id": 1,
      "stock_no": "string",
      "date_in_stock": "date",
      "ready_to_shell": "date",
      "location": "string",
      "emission_status_id": 1,
      "inspection_status_id": 1,
      "condition_id": 1,
      "sales_type_id": 1,
      "emission": { "id": 1, "status_id": 1, "date": "date" },
      "inspection": { "id": 1, "status_id": 1, "date": "date", "id_of_status": "string", "inspected_by": "string" },
      "sales_category": { "id": 1, "category": "string" }
    },
    "purchase_info": { "id": 1, "purchase_date": "date", "purchase_detail": "string", "acq_mill_in": "string", "acq_mill_type_id": 1, "buyer": "string", "source_id": 1, "purchase_from": "string", "how_did_you_pay": "string" },
    "title_license": { "id": 1, "title_owner": "string", "ros_title": "string", "title_state_id": 1, "title_status_id": 1, "title_brand_id": 1, "license_no": "string", "license_state_id": 1, "license_expiration": "date", "asking_price": "string", "whole_price": "string", ... },
    "key_info": { "id": 1, "decal_no": "string", "ignition_code": "string", "door_key_code": "string", "valet_key_code": "string", "duplicate_key": true, ... },
    "vehicle_identification_numbers": { "id": 1, "vin": "string" },
    "vehicle_status": { "id": 1, "status": "string" },
    "vehicle_brands": { "id": 1, "brand": "string" },
    "exterior_vehicle_colors": { "id": 1, "color": "string" },
    "interior_vehicle_colors": { "id": 1, "color": "string" },
    "vehicle_models": { "id": 1, "model": "string" },
    "vehicle_manufacture_years": { "id": 1, "year": "string" },
    "vehicle_trim": { "id": 1, "trim": "string" },
    "vehicle_engine": { "id": 1, "engine": "string" },
    "vehicle_image": { "id": 1, "path": "string" },
    "body_type": { "id": 1, "type": "string" },
    "vehicle_transmissions": { "id": 1, "type": "string" },
    "vehicle_prices": { "id": 1, "price": "string" },
    "vehicle_fuel_tank_types": { "id": 1, "type": "string" },
    "vehicle_conditions": { "id": 1, "condition": "string" },
    "vehicle_mileages": { "id": 1, "mileage": "string" },
    "vehicle_drive_train": { "id": 1, "type": "string" },
    "vehicle_type": { "id": 1, "type": "string" }
  }
]
```

**500:** `{ serverError: 'Server Error' }`

---

**POST /inventory/vehicle**
(Registra un nuevo vehículo con toda su información inicial)

**Body (FormData):**
- Campos de información general, compra, detalles del vehículo, títulos y llaves (muy extenso, ver esquema de validación en el código).

**200:** `{ successMessage: 'Vehicle Successfully Registered' }`

**422:** `{ fieldErrors: { ... } }`

**500:** `{ serverError: 'Server Error' }`

---

**GET /inventory/vehicle/{id}**
(Obtiene el detalle completo de un vehículo específico)

**200:** Objeto único con la misma estructura detallada en el listado general.

**500:** `{ serverError: 'Server Error' }`

---

**DELETE /inventory/vehicle/{id}**
(Elimina permanentemente un registro de vehículo)

**Permissions:** 26

**200:** `{ successMessage: 'Item Successfully Deleted' }`

**500:** `{ serverError: 'Server Error' }`

---

**PUT /inventory/addVehicle/{id}**
(Actualiza la información técnica/específica del vehículo, VIN, Motor, Transmisión, etc.)

**Body (FormData):**
- `status`, `customStatus`, `newUsed`, `vehicleType`, `vin`, `odometer`, `make1`, `year`, `make2`, `model`, `trim`, `engine`, `transmission`, `driveTrain`, `door`, `cylinder`, `bodyType`, `fuelType`, `horsePower`, `exterior`, `interior`, `mpgCity`, `hwy`, `vehicleWeight`, `gvw`, `vehicleImage` (archivo), `imageId`, `vinId`, `firebaseImage`.

**200:** `{ successMessage: 'Data Successfully Updated' }`

**422:** `{ fieldErrors: { ... } }`

**500:** `{ serverError: 'Server Error' }`

---

**PUT /inventory/titleLicense/{id}**
(Actualiza específicamente la sección de títulos, licencias y precios)

**Body (FormData):**
- `titleOwner`, `rosTitle`, `titleState`, `titleStatus`, `titleBrand`, `licenseNo`, `licenseState`, `licenseExpiration`, `askingPrice`, `wholePrice`, `adversiting`, `floorPrice`, `specialPrice`, `specialPriceStartDate`, `specialPriceEndDate`, `buyNowPrice`, `msrp`, `startBid`, `minDown`, `startBid2`, `minDeposit`, `bidIncrement`, `vehicleCost`, `costAdds`, `packs`, `additional`.

**200:** `{ successMessage: 'Data Successfully Updated' }`

**422:** `{ fieldErrors: { ... } }`

**500:** `{ serverError: 'Server Error' }`

---

**CATÁLOGOS DE INVENTARIO (GET)**
(Endpoints que devuelven listados para selectores de formularios)

**Endpoints:**
- `/inventory/acqType`
- `/inventory/color`
- `/inventory/condition`
- `/inventory/driveTrain`
- `/inventory/emissionStatus`
- `/inventory/engine`
- `/inventory/fuelType`
- `/inventory/inspectionStatus`
- `/inventory/make`
- `/inventory/model`
- `/inventory/odometerType`
- `/inventory/paymentMethod`
- `/inventory/salesType`
- `/inventory/source`
- `/inventory/status` (Estados de inventario: Sold, Available, etc.)
- `/inventory/titleBrand`
- `/inventory/titleStatus`
- `/inventory/transmission`
- `/inventory/trim`
- `/inventory/type` (Tipos de vehículo)

**200 (Ejemplo para /inventory/make):**
```json
[
  {
    "id": 1,
    "brand": "Toyota"
  }
]
```

**200 (Estructura genérica):**
```json
[
  {
    "id": number,
    "name/type/status/brand/etc": "string"
  }
]
```

**500:** `{ serverError: 'Server Error' }`

---

### [Módulo: Admin Dashboard Dailys]

**GET /adminDashboard/dailyCalls/{userId}**  
(Obtiene el listado de llamadas realizadas hoy por un usuario o por todos si es admin)

**Params:** `userId` (ID del usuario)  
**Query Params:** `timezone` (Opcional, default: 'America/Chicago')

**200:**
```json
[
  {
    "id": 1,
    "client_call": {
      "id": 1,
      "first_name": "string",
      "last_name": "string",
      "seller": {
        "id": 1,
        "name": "string",
        "last_name": "string"
      }
    },
    "call_date": "date-time",
    "call_direction_id": 1,
    "call_duration": "string",
    "phone_number": "string"
  }
]
```

**500:** `{ serverError: 'Server Error' }`

---

**PUT /adminDashboard/dailyAppointments/{id}**  
(Actualiza el estado de una cita desde el dashboard diario)

**Params:** `id` (ID de la cita)  
**Body (FormData):**
- `action` (string, requerido): ID del nuevo estado de la cita.

**200:** `{ successMessage: 'Status Successfully Changed' }`

**422:** `{ action: ["Please enter a value"] }`

**500:** `{ serverError: 'Server Error' }`

---

**GET /adminDashboard/dailyMadeAppointments/{userId}**  
(Obtiene las citas creadas hoy por un usuario específico o por todos si es admin)

**Params:** `userId` (ID del creador)  
**Query Params:** `timezone` (Opcional, default: 'America/Chicago')

**200:**
```json
[
  {
    "id": 1,
    "created_at": "date-time",
    "customers": {
      "id": 1,
      "first_name": "string",
      "last_name": "string",
      "mobile_phone": "string",
      "home_phone": "string",
      "home_default": "string",
      "email": "string",
      "interested_vehicle": {
        "id": 1,
        "vehicle_brands": { "id": 1, "brand": "string" },
        "vehicle_models": { "id": 1, "model": "string" },
        "vehicle_manufacture_years": { "id": 1, "year": "string" },
        "vehicle_identification_numbers": { "id": 1, "vin": "string" }
      }
    },
    "users": {
        "name": "string",
        "last_name": "string"
    },
    "appointments_status": {
        "status": "string"
    }
  }
]
```

**500:** `{ serverError: 'Server Error' }`

---

**GET /adminDashboard/dailyMadeCreditApp**  
(Obtiene las solicitudes de crédito creadas hoy)

**Query Params:** `timezone` (Opcional, default: 'America/Chicago')

**200:**
```json
[
  {
    "id": 1,
    "client": {
      "id": 1,
      "first_name": "string",
      "last_name": "string",
      "mobile_phone": "string",
      "seller": {
        "id": 1,
        "name": "string",
        "last_name": "string",
        "username": "string"
      },
      "appointment": [
        {
          "id": 1,
          "start_date": "date-time",
          "client_accept_appointment": "boolean"
        }
      ],
      "interested_vehicle": {
        "id": 1,
        "vehicle_brands": { "id": 1, "brand": "string" },
        "vehicle_models": { "id": 1, "model": "string" },
        "vehicle_identification_numbers": { "id": 1, "vin": "string" },
        "vehicle_manufacture_years": { "id": 1, "year": "string" }
      },
      "credit_app_list_status": {
        "id": 1,
        "status": "string"
      }
    }
  }
]
```

**500:** `{ serverError: 'Sever Error' }`

---

**GET /adminDashboard/dailyMessages/{userId}**  
(Obtiene los mensajes enviados hoy, uno por cliente)

**Params:** `userId` (ID del usuario)  
**Query Params:** `timezone` (Opcional, default: 'America/Chicago')

**200:**
```json
[
  {
    "id": 1,
    "date_sent": "date-time",
    "client_message": {
      "id": 1,
      "first_name": "string",
      "last_name": "string",
      "lead_temperature_id": 1,
      "email": "string",
      "mobile_phone": "string",
      "client_status": { "status": "string" },
      "seller": { "id": 1, "name": "string", "last_name": "string" }
    },
    "user": [
        {
            "name": "string",
            "last_name": "string",
            "id": 1
        }
    ],
    "status": { "status": "string" },
    "unregistered_customer": [
        {
            "id": 1,
            "mobile_phone_number": "string",
            "user": { "name": "string", "last_name": "string", "id": 1 }
        }
    ]
  }
]
```

**500:** `{ serverError: 'Server Error' }`

---

**GET /adminDashboard/dailyTotals/{userId}**  
(Obtiene los contadores de actividades para el dashboard diario)

**Params:** `userId` (ID del usuario)  
**Query Params:** `timeZone` (Opcional, default: 'America/Chicago') - *Nota: case sensitive*

**200:**
```json
{
  "dailyCallsCount": 0,
  "dailyMessagesCount": 0,
  "dailyMadeAppointmentCount": 0,
  "missingTasksCount": 0,
  "dailyMadeCreditAppCount": 0,
  "dailySellsCount": 0
}
```

**500:** `{ serverError: 'Server Error' }`