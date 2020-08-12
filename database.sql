-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Tempo de geração: 12/08/2020 às 12:02
-- Versão do servidor: 10.4.12-MariaDB-1:10.4.12+maria~bionic
-- Versão do PHP: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Banco de dados: `pensieve`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `blocks`
--

CREATE TABLE `blocks` (
  `id` bigint(20) NOT NULL,
  `url` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `link` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `paragraph` text COLLATE utf8_unicode_ci NOT NULL,
  `type` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N' COMMENT '(N)eutral, (P)ending, (R)esolved'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `block_tag`
--

CREATE TABLE `block_tag` (
  `id` bigint(20) NOT NULL,
  `id_block` bigint(20) NOT NULL,
  `id_tag` bigint(20) NOT NULL,
  `type` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'B' COMMENT '(H)eader, (B)ody',
  `sort` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tags`
--

CREATE TABLE `tags` (
  `id` bigint(20) NOT NULL,
  `slug` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'K' COMMENT '(C)ontext, (P)age, (K)eyword'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tag_tag`
--

CREATE TABLE `tag_tag` (
  `id` bigint(20) NOT NULL,
  `id_super_tag` bigint(20) NOT NULL,
  `id_sub_tag` bigint(20) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `blocks`
--
ALTER TABLE `blocks`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `block_tag`
--
ALTER TABLE `block_tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_block` (`id_block`),
  ADD KEY `id_tag` (`id_tag`);

--
-- Índices de tabela `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `tag_tag`
--
ALTER TABLE `tag_tag`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `blocks`
--
ALTER TABLE `blocks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `block_tag`
--
ALTER TABLE `block_tag`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tag_tag`
--
ALTER TABLE `tag_tag`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `block_tag`
--
ALTER TABLE `block_tag`
  ADD CONSTRAINT `block_tag_ibfk_1` FOREIGN KEY (`id_block`) REFERENCES `blocks` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `block_tag_ibfk_2` FOREIGN KEY (`id_tag`) REFERENCES `tags` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;
