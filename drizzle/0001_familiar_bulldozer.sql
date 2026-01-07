CREATE TABLE `addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`direccion1` varchar(200),
	`direccion2` varchar(200),
	`coloniaPoblacion` varchar(100),
	`delegacionMunicipio` varchar(100),
	`ciudad` varchar(100),
	`estado` varchar(4),
	`cp` varchar(10),
	`codPais` varchar(2),
	`fechaResidencia` varchar(10),
	`numeroTelefono` varchar(20),
	`tipoDomicilio` varchar(1),
	`tipoAsentamiento` varchar(3),
	`isPrimary` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`alertType` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`severity` enum('info','warning','critical') NOT NULL DEFAULT 'info',
	`isRead` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nombres` varchar(100),
	`apellidoPaterno` varchar(100),
	`apellidoMaterno` varchar(100),
	`rfc` varchar(13),
	`curp` varchar(18),
	`fechaNacimiento` varchar(10),
	`nacionalidad` varchar(2),
	`telefono` varchar(20),
	`celular` varchar(20),
	`email` varchar(320),
	`identificacionBuro` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `credit_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`claveOtorgante` varchar(20),
	`nombreOtorgante` varchar(200),
	`numeroCuentaActual` varchar(50),
	`tipoContrato` varchar(4),
	`tipoCuenta` varchar(1),
	`tipoResponsabilidad` varchar(1),
	`claveUnidadMonetaria` varchar(3),
	`limiteCredito` decimal(15,2),
	`creditoMaximo` decimal(15,2),
	`saldoActual` decimal(15,2),
	`saldoVencido` decimal(15,2),
	`montoPagar` decimal(15,2),
	`montoUltimoPago` decimal(15,2),
	`fechaAperturaCuenta` varchar(10),
	`fechaCierreCuenta` varchar(10),
	`fechaUltimoPago` varchar(10),
	`fechaUltimaCompra` varchar(10),
	`fechaReporte` varchar(10),
	`fechaActualizacion` varchar(10),
	`formaPagoActual` varchar(3),
	`frecuenciaPagos` varchar(1),
	`numeroPagos` int,
	`numeroPagosVencidos` int,
	`historicoPagos` text,
	`mopHistoricoMorosidadMasGrave` varchar(3),
	`fechaHistoricaMorosidadMasGrave` varchar(10),
	`totalPagosReportados` int,
	`totalPagosCalificadosMOP2` int,
	`totalPagosCalificadosMOP3` int,
	`totalPagosCalificadosMOP4` int,
	`totalPagosCalificadosMOP5` int,
	`claveObservacion` varchar(10),
	`registroImpugnado` varchar(1),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `credit_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `credit_queries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`claveOtorgante` varchar(20),
	`nombreOtorgante` varchar(200),
	`telefonoOtorgante` varchar(20),
	`fechaConsulta` varchar(10),
	`tipoContrato` varchar(4),
	`claveUnidadMonetaria` varchar(3),
	`importeContrato` decimal(15,2),
	`indicadorTipoResponsabilidad` varchar(1),
	`tipoConsulta` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `credit_queries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `credit_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`reportType` varchar(50) NOT NULL,
	`folioConsulta` varchar(50),
	`folioConsultaOtorgante` varchar(50),
	`claveOtorgante` varchar(20),
	`responseData` json,
	`pdfUrl` varchar(500),
	`pdfKey` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `credit_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`documentType` varchar(50) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` varchar(500) NOT NULL,
	`mimeType` varchar(100),
	`fileSize` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`nombreEmpresa` varchar(200),
	`direccion` varchar(200),
	`coloniaPoblacion` varchar(100),
	`delegacionMunicipio` varchar(100),
	`ciudad` varchar(100),
	`estado` varchar(4),
	`cp` varchar(10),
	`numeroTelefono` varchar(20),
	`extension` varchar(10),
	`fax` varchar(20),
	`puesto` varchar(100),
	`fechaContratacion` varchar(10),
	`claveMoneda` varchar(3),
	`salarioMensual` decimal(15,2),
	`fechaUltimoDiaEmpleo` varchar(10),
	`fechaVerificacionEmpleo` varchar(10),
	`isCurrent` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `llm_analysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`analysisType` varchar(50) NOT NULL,
	`analysisData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `llm_analysis_id` PRIMARY KEY(`id`)
);
