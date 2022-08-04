-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-06-2022 a las 06:07:55
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ulp_system`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `attendances`
--

CREATE TABLE `attendances` (
  `id` int(11) NOT NULL,
  `id_registration` int(11) NOT NULL,
  `day` int(11) NOT NULL,
  `month` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horaries`
--

CREATE TABLE `horaries` (
  `id` int(11) NOT NULL,
  `dayOfWeek` varchar(15) NOT NULL,
  `startAt` varchar(5) NOT NULL,
  `endAt` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `horaries`
--

INSERT INTO `horaries` (`id`, `dayOfWeek`, `startAt`, `endAt`) VALUES
(1, 'Lunes', '15:30', '18:00'),
(2, 'Martes', '08:00', '11:00'),
(3, 'Viernes', '01:00', '02:00'),
(4, 'Jueves', '23:40', '00:00'),
(5, 'Lunes', '08:00', '11:00'),
(6, 'Lunes', '10:00', '08:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registrations`
--

CREATE TABLE `registrations` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_subject` int(11) NOT NULL,
  `validated` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `registrations`
--

INSERT INTO `registrations` (`id`, `id_user`, `id_subject`, `validated`) VALUES
(1, 5, 1, 0),
(2, 5, 2, 1),
(5, 14, 7, 1),
(6, 5, 7, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Coordinator'),
(2, 'Professor'),
(3, 'Student');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `average` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `average`) VALUES
(1, 'Inglés I', 0),
(2, 'Matemáticas I', 0),
(3, 'Redes de computadoras', 0),
(4, 'Inglés II', 0),
(5, 'Estructuras de datos y algoritmos', 0),
(6, 'Ingeniería de software', 0),
(7, 'Bases de datos', 0),
(8, 'Laboratorio de programación II', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subjects-horaries`
--

CREATE TABLE `subjects-horaries` (
  `id` int(11) NOT NULL,
  `id_subject` int(11) NOT NULL,
  `id_horary` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `subjects-horaries`
--

INSERT INTO `subjects-horaries` (`id`, `id_subject`, `id_horary`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 4),
(4, 2, 3),
(10, 7, 5),
(12, 7, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(25) NOT NULL,
  `password` varchar(100) NOT NULL,
  `first_name` varchar(25) NOT NULL,
  `last_name` varchar(25) NOT NULL,
  `dni` int(11) NOT NULL,
  `id_role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`, `dni`, `id_role`) VALUES
(5, 'alumno1@mail.com', '$2b$10$Q7SF2r5gMWM4wRCpFT43u.Xwjqj7zJgwaITlX.8MEoCt26SLdNTS.', 'alumno1', 'perez', 82938828, 3),
(7, 'admin@admin.com', '$2b$10$KfGAzoB0wUqRdq6rrNBIhuVryq0qrj7/p/YOnSSlodTNoe0qcGgxK', 'Bruno', 'Diaz', 32145690, 1),
(8, 'jjsaez@mail.com', '$2b$10$Tvm67rp3kPE81fvR4I5Rt./x6T2Daz/Yhguq61Qdi.P04kYLXLzLW', 'Juan', 'Saez', 6568464, 2),
(9, 'peblanco@mail.com', '$2b$10$LfY6wlIKHYSQRZ9L0ZNgbOL1s4/svot5EwhiQXYRl5wGwCHXOXR0e', 'Pedro', 'Blanco', 32424142, 2),
(10, 'Efimenco@mail.com', '$2b$10$w5ox91HuxQ2/ZDvO3nb4GOYmQolW4hmRgVAASkSYEZKSJczvOVfBm', 'Cinttia', 'Efimenco', 64984351, 2),
(11, 'jobusca@mail.com', '$2b$10$eTncUF0ftw/rEQBglnv90uMISi1QXQojON41oQBFpYYUyF6H.fTVy', 'Jorge', 'Buscarolo', 48965123, 2),
(12, 'csaez@mail.com', '$2b$10$cAoQcxNYB6g/7Mf155zU6epEjrSm.YcxKJSHvzWXvyeQOgKZl6b92', 'Cristina', 'Saez', 57892477, 2),
(13, 'fsaez@mail.com', '$2b$10$9wilymodci7G28W1RzN45eqnXVkQD/g24OvS4XiKYjN04LEAUvFLC', 'Fernando', 'Saez', 23987839, 2),
(14, 'pepa@mail.com', '$2b$10$RrvaYmlpo00FEQWpdOf05ekj72Zdu7/9CxfdQlSzIZDc71O0Mz4L6', 'Pepa', 'Diaz', 4654, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users-subjects`
--

CREATE TABLE `users-subjects` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_subject` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users-subjects`
--

INSERT INTO `users-subjects` (`id`, `id_user`, `id_subject`) VALUES
(4, 8, 6),
(5, 9, 7),
(6, 10, 1),
(8, 12, 5),
(9, 13, 8),
(10, 11, 7);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_registration` (`id_registration`);

--
-- Indices de la tabla `horaries`
--
ALTER TABLE `horaries`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `registrations`
--
ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_subject` (`id_subject`),
  ADD KEY `id_user` (`id_user`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `name_2` (`name`);

--
-- Indices de la tabla `subjects-horaries`
--
ALTER TABLE `subjects-horaries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_horary` (`id_horary`),
  ADD KEY `id_subject` (`id_subject`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_role` (`id_role`);

--
-- Indices de la tabla `users-subjects`
--
ALTER TABLE `users-subjects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_subject` (`id_subject`),
  ADD KEY `id_user` (`id_user`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `horaries`
--
ALTER TABLE `horaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `registrations`
--
ALTER TABLE `registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `subjects-horaries`
--
ALTER TABLE `subjects-horaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `users-subjects`
--
ALTER TABLE `users-subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`id_registration`) REFERENCES `registrations` (`id`);

--
-- Filtros para la tabla `registrations`
--
ALTER TABLE `registrations`
  ADD CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`id_subject`) REFERENCES `subjects` (`id`),
  ADD CONSTRAINT `registrations_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `subjects-horaries`
--
ALTER TABLE `subjects-horaries`
  ADD CONSTRAINT `subjects-horaries_ibfk_1` FOREIGN KEY (`id_horary`) REFERENCES `horaries` (`id`),
  ADD CONSTRAINT `subjects-horaries_ibfk_2` FOREIGN KEY (`id_subject`) REFERENCES `subjects` (`id`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`);

--
-- Filtros para la tabla `users-subjects`
--
ALTER TABLE `users-subjects`
  ADD CONSTRAINT `users-subjects_ibfk_1` FOREIGN KEY (`id_subject`) REFERENCES `subjects` (`id`),
  ADD CONSTRAINT `users-subjects_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
