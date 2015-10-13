<?php
/**
 * Created by PhpStorm.
 * Cliente: kn
 * Date: 16/03/15
 * Time: 19:13
 */
require 'PHPMailerAutoload.php';

session_start();
$jwt_enabled = true;

if (file_exists('../../../MyDBi.php')) {
    require_once '../../../MyDBi.php';
} else {
    require_once 'MyDBi.php';
}


if ($jwt_enabled) {
    if (file_exists('../../../jwt_helper.php')) {
        require_once '../../../jwt_helper.php';
    } else {
        require_once 'jwt_helper.php';
    }
}


$data = file_get_contents("php://input");

$decoded = json_decode($data);
//$token = '';

if ($jwt_enabled) {
    if ($decoded != null && ($decoded->function == 'login' ||
            $decoded->function == 'create' ||
            $decoded->function == 'existeCliente' ||
            $decoded->function == 'forgotPassword')
    ) {

        $token = '';
    } else {
        checkSecurity();
    }
}
$decoded_token = null;

function checkSecurity()
{
    $requestHeaders = apache_request_headers();
    $authorizationHeader = $requestHeaders['Authorization'];
//    echo print_r(apache_request_headers());


    if ($authorizationHeader == null) {
        header('HTTP/1.0 401 Unauthorized');
        echo "No authorization header sent";
        exit();
    }

    // // validate the token
    $pre_token = str_replace('Bearer ', '', $authorizationHeader);
    $token = str_replace('"', '', $pre_token);
    $secret = 'uiglp';
    global $decoded_token;
    try {
        $decoded_token = JWT::decode($token, base64_decode(strtr($secret, '-_', '+/')), false);
//        $decoded_token = JWT::decode($token, 'uiglp');
    } catch (UnexpectedValueException $ex) {
        header('HTTP/1.0 401 Unauthorized');
        echo "Invalid token";
        exit();
    }


    // // validate that this token was made for us
    if ($decoded_token->aud != 'uiglp') {
        header('HTTP/1.0 401 Unauthorized');
        echo "Invalid token";
        exit();
    }

}


if ($decoded != null) {
    if ($decoded->function == 'login') {
        login($decoded->mail, $decoded->password);
    } else if ($decoded->function == 'checkLastLogin') {
        checkLastLogin($decoded->userid);
    } else if ($decoded->function == 'create') {
        create($decoded->user);
    } else if ($decoded->function == 'getClienteByEmail') {
        getClienteByEmail($decoded->email);
    } else if ($decoded->function == 'resetPassword') {
        resetPassword($decoded->cliente_id, $decoded->new_password);
    } else if ($decoded->function == 'getClienteByEmailAndPassword') {
        getClienteByEmailAndPassword($decoded->email, $decoded->password);
    } else if ($decoded->function == 'existeCliente') {
        existeCliente($decoded->username);
    } else if ($decoded->function == 'changePassword') {
        changePassword($decoded->cliente_id, $decoded->pass_old, $decoded->pass_new);
    } else if ($decoded->function == 'getHistoricoPedidos') {
        getHistoricoPedidos($decoded->cliente_id);
    } else if ($decoded->function == 'update') {
        update($decoded->user);
    } else if ($decoded->function == 'deleteCliente') {
        deleteCliente($decoded->cliente_id);
    } else if ($decoded->function == 'forgotPassword') {
        forgotPassword($decoded->email);
    }
} else {
    $function = $_GET["function"];
    if ($function == 'getHistoricoPedidos') {
        getHistoricoPedidos($_GET["cliente_id"]);
    } elseif ($function == 'getClientes') {
        getClientes();
    } elseif ($function == 'getFotos') {
        getFotos();
    } elseif ($function == 'getDescargas') {
        getDescargas();
    }
}


function forgotPassword($email)
{

    $db = new MysqliDb();
    $options = ['cost' => 12];
    $new_password = randomPassword();

    $password = password_hash($new_password, PASSWORD_BCRYPT, $options);

    $data = array('password' => $password);

    $db->where('mail', $email);
    if ($db->update('clientes', $data)) {
        $mail = new PHPMailer;
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'gator4184.hostgator.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'ventas@ac-desarrollos.com';                 // SMTP username
        $mail->Password = 'ventas';                           // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;

        $mail->From = 'ventas@ac-desarrollos.com';
        $mail->FromName = 'UIGLP';
        $mail->addAddress($email);     // Add a recipient
        $mail->addAddress('arielcessario@gmail.com');     // Add a recipient
        $mail->addAddress('juan.dilello@gmail.com');               // Name is optional
        $mail->addAddress('diegoyankelevich@gmail.com');
        $mail->isHTML(true);    // Name is optional

        $mail->Subject = 'Recuperar Contraseña UGLP';
        $mail->Body = "<table>
    <tr><td>Te enviamos a continuación la siguiente contraseña.</td></tr>
    <tr><td>Nueva Contraseña:</td></tr>
    <tr><td>" . $new_password . "</td></tr>
    <tr><td>UIGLP</td></tr>
    <tr><td></td></tr>
    <tr><td></td></tr>
</table>";
        $mail->AltBody = "Nuevo Mail:" . $new_password;

        if (!$mail->send()) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            echo 'Message has been sent';
        }
    }
}

function randomPassword()
{
    $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    $pass = array(); //remember to declare $pass as an array
    $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
    for ($i = 0; $i < 8; $i++) {
        $n = rand(0, $alphaLength);
        $pass[] = $alphabet[$n];
    }
    return implode($pass); //turn the array into a string
}

function getFotos()
{
    $directorio = './fotos';
    $ficheros1 = array_diff(scandir($directorio), array('..', '.'));
    echo json_encode($ficheros1);
}

function getDescargas()
{
    $directorio = './descargas';
    $ficheros1 = array_diff(scandir($directorio), array('..', '.'));
    echo json_encode($ficheros1);
}


function createToken($id, $username, $nombre, $rol)
{

    $tokenId = base64_encode(mcrypt_create_iv(32));
    $issuedAt = time();
    $notBefore = $issuedAt + 10;             //Adding 10 seconds
    $expire = $notBefore + 60;            // Adding 60 seconds
    $serverName = 'serverName'; // Retrieve the server name from config file
    $aud = 'uiglp';
//        $serverName = $config->get('serverName'); // Retrieve the server name from config file

    /*
     * Create the token as an array
     */
    $data = [
        'iat' => $issuedAt,         // Issued at: time when the token was generated
        'jti' => $tokenId,          // Json Token Id: an unique identifier for the token
        'iss' => $serverName,       // Issuer
        'nbf' => $notBefore,        // Not before
        'exp' => $expire,           // Expire
        'aud' => $aud,           // Expire
        'data' => [                  // Data related to the signer user
            'userId' => $id, // userid from the users table
            'userName' => $username, // User name
            'nombre' => $nombre, // User name
            'rol' => $rol // Rol
        ]
    ];

    return JWT::encode($data, 'uiglp');
    /*
     * More code here...
     */
}


function deleteCliente($cliente_id)
{
    $db = new MysqliDb();

    $db->where("cliente_id", $cliente_id);
    $results = $db->delete('clientes');

    echo json_encode($results);
}

function getClientes()
{
    $db = new MysqliDb();
    $results = $db->get('clientes');
    foreach ($results as $key => $row) {
        $results[$key]['password'] = '';
    }

    echo json_encode($results);
}


function login($mail, $password)
{
    $db = new MysqliDb();
    $db->where("mail", $mail);

    $results = $db->get("clientes");

    global $jwt_enabled;

    if ($db->count > 0) {

        $hash = $results[0]['password'];
        if (password_verify($password, $hash) && $results[0]['status'] != 0) {

            if ($jwt_enabled) {
                echo json_encode(createToken($results[0]['cliente_id'], $mail, $results[0]['nombre'], $results[0]['rol_id']));
            } else {
                echo json_encode($results);
            }
        } else {

            echo json_encode(-1);
        }
    } else {
        echo json_encode(-1);
    }


}

function checkLastLogin($userid)
{
    $db = new MysqliDb();
    $results = $db->rawQuery('select TIME_TO_SEC(TIMEDIFF(now(), last_login)) diferencia from clientes where cliente_id = ' . $userid);

    if ($db->count < 1) {
        $db->rawQuery('update clientes set token ="" where cliente_id =' . $userid);
        echo(json_encode(false));
    } else {
        $diff = $results[0]["diferencia"];

        if (intval($diff) < 12960) {
            echo(json_encode($results[0]));
        } else {
            $db->rawQuery('update clientes set token ="" where cliente_id =' . $userid);
            echo(json_encode(false));
        }
    }
}


function create($user)
{
    $db = new MysqliDb();
    $user_decoded = json_decode($user);
    $options = ['cost' => 12];
    $password = password_hash($user_decoded->password, PASSWORD_BCRYPT, $options);

//    $nro_doc = '';
    if (array_key_exists('nro_doc', $user_decoded)) {
        $nro_doc = $user_decoded->nro_doc;
    } else {
        $nro_doc = '';
    }


    if (array_key_exists('tipo_doc', $user_decoded)) {
        $tipo_doc = $user_decoded->tipo_doc;
    } else {
        $tipo_doc = 0;
    }

    if (array_key_exists('rol_id', $user_decoded)) {
        $rol_id = $user_decoded->rol_id;
    } else {
        $rol_id = 0;
    }

    if (array_key_exists('fecha_nacimiento', $user_decoded)) {
        $fecha_nacimiento = $user_decoded->fecha_nacimiento;
    } else {
        $fecha_nacimiento = '';
    }

    if (array_key_exists('news_letter', $user_decoded)) {
        $news_letter = $user_decoded->news_letter;
    } else {
        $news_letter = 0;
    }

    $data = array(
        'nombre' => $user_decoded->nombre,
        'apellido' => $user_decoded->apellido,
        'mail' => $user_decoded->mail,
        'password' => $password,
        'tipo_doc' => $tipo_doc,
        'nro_doc' => $nro_doc,
        'fecha_nacimiento' => $fecha_nacimiento,
        'direccion' => $user_decoded->direccion,
        'telefono' => $user_decoded->telefono,
        'rol_id' => $rol_id,
        'news_letter' => $news_letter
    );

    $result = $db->insert('clientes', $data);
    if ($result > -1) {
        echo json_encode(true);
    } else {
        echo json_encode(false);
    }
}

/**
 * esta funcion me retorna un cliente filtrando x email
 * @param $email
 */
function getClienteByEmail($email)
{
    //Instancio la conexion con la DB
    $db = new MysqliDb();
    //Armo el filtro por email
    $db->where("mail", $email);
    //Que me retorne el cliente filtrando por email
    $results = $db->get("clientes");
    //Serializo el resultado
    $response = ['cliente' => json_encode($results[0]), 'cliente_id' => $results[0]['cliente_id']];
    //retorno el resultado serializado
    echo json_encode($response);
}

function resetPassword($cliente_id, $new_password)
{
    $db = new MysqliDb();
    $options = ['cost' => 12];
    $password = password_hash($new_password, PASSWORD_BCRYPT, $options);

    $data = array('password' => $password);

    $db->where('cliente_id', $cliente_id);
    if ($db->update('clientes', $data)) {
        echo json_encode(['result' => true, 'new_password' => $new_password, 'password_hashed' => $password]);
    } else {
        echo json_encode(['result' => false, 'new_password' => $new_password, 'password_hashed' => $password]);
    }
}

function getClienteByEmailAndPassword($email, $password)
{
    //Instancio la conexion con la DB
    $db = new MysqliDb();
    //Armo el filtro por email
    $db->where("mail", $email);
    //Que me retorne el cliente filtrando por email
    $results = $db->get("clientes");

    $hash = $results[0]['password'];

    if (password_verify($password, $hash)) {
        $response = ['user' => json_encode($results[0]), 'result' => true, 'password' => $password, 'hash' => $hash, 'pwd_info' => password_get_info($hash)];
    } else {
        $response = ['user' => json_encode(null), 'result' => false, 'password' => $password, 'hash' => $hash, 'pwd_info' => password_get_info($hash)];
    }
    //retorno el resultado serializado
    echo json_encode($response);
}

function existeCliente($username)
{
    //Instancio la conexion con la DB
    $db = new MysqliDb();
    //Armo el filtro por email
    $db->where("mail", $username);

    //Que me retorne el cliente filtrando por email
    $results = $db->get("clientes");

    //Serializo el resultado
//    $response = ['user' => json_encode($results[0])];

    //retorno el resultado serializado
    if ($db->count > 0) {

        echo json_encode(true);
    } else {
        echo json_encode(false);

    }
}

function changePassword($cliente_id, $pass_old, $pass_new)
{
    $db = new MysqliDb();

    $db->where('cliente_id', $cliente_id);
    $results = $db->get("clientes");

    if ($db->count > 0) {
        $result = $results[0];
        $options = ['cost' => 12];
        $password = password_hash($pass_new, PASSWORD_BCRYPT, $options);
        $db->where('cliente_id', $cliente_id);
        $data = array('password' => $password);
        if ($db->update('clientes', $data)) {
            echo json_encode(1);
        } else {
            echo json_encode(-1);
        }
    } else {
        echo json_encode(-1);
    }
}

function update($user)
{
    $db = new MysqliDb();
    $user_decoded = json_decode($user);

    $db->where('cliente_id', $user_decoded->cliente_id);

    if (array_key_exists('nro_doc', $user_decoded)) {
        $nro_doc = $user_decoded->nro_doc;
    } else {
        $nro_doc = '';
    }


    if (array_key_exists('tipo_doc', $user_decoded)) {
        $tipo_doc = $user_decoded->tipo_doc;
    } else {
        $tipo_doc = 0;
    }

    if (array_key_exists('fecha_nacimiento', $user_decoded)) {
        $fecha_nacimiento = $user_decoded->fecha_nacimiento;
    } else {
        $fecha_nacimiento = '';
    }

    if (array_key_exists('rol_id', $user_decoded)) {
        $rol_id = $user_decoded->rol_id;
    } else {
        $rol_id = 0;
    }

    if (array_key_exists('news_letter', $user_decoded)) {
        $news_letter = $user_decoded->news_letter;
    } else {
        $news_letter = 0;
    }

    $data = array(
        'nombre' => $user_decoded->nombre,
        'apellido' => $user_decoded->apellido,
        'mail' => $user_decoded->mail,
        'tipo_doc' => $tipo_doc,
        'nro_doc' => $nro_doc,
        'direccion' => $user_decoded->direccion,
        'fecha_nacimiento' => $fecha_nacimiento,
        'rol_id' => $rol_id,
        'news_letter' => $news_letter,
        'status' => $user_decoded->status
    );

    if ($user_decoded->password != '') {
        changePassword($user_decoded->cliente_id, '', $user_decoded->password);
    }

    if ($db->update('clientes', $data)) {

        echo json_encode(['result' => true]);
    } else {
        echo json_encode(['result' => false]);
    }
}

function getHistoricoPedidos($cliente_id)
{
    $db = new MysqliDb();

    $pedidos = array();

    $SQL = "SELECT carritos.carrito_id,
            carritos.status,
            carritos.total,
            date(carritos.fecha) as fecha,
            carritos.cliente_id,
            0 detalles
            FROM carritos
            WHERE cliente_id = " . $cliente_id . " ORDER BY carritos.carrito_id DESC;";

    $results = $db->rawQuery($SQL);

    foreach ($results as $row) {
        $SQL = 'SELECT
                carrito_detalle_id,
                p.producto_id,
                cantidad,
                precio,
                p.nombre
                FROM carrito_detalles cd
                INNER JOIN productos p
                ON cd.producto_id = p.producto_id
                WHERE carrito_id = ' . $row['carrito_id'] . ';';

        $detalle = $db->rawQuery($SQL);
        $row['detalles'] = $detalle;
        array_push($pedidos, $row);
    }

    echo json_encode($pedidos);
}