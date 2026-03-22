# Gestión de Multas – Roadmap Funcional del Sistema (v2)

## Introducción

Este documento describe el roadmap funcional del sistema de **Gestión de Multas**, orientado a la administración de consultas y casos vinculados a infracciones de tránsito.

El objetivo del sistema es:

- centralizar y ordenar la información
- reducir el trabajo manual repetitivo
- mejorar la eficiencia operativa
- permitir escalar volumen sin aumentar proporcionalmente la carga administrativa

El enfoque es progresivo:

primero se implementan capacidades básicas de software, luego automatizaciones, y solo de forma opcional se incorpora inteligencia artificial en tareas puntuales donde aporte valor concreto.

---

## 1. Alcance y objetivos

El sistema está diseñado para:

- recibir y gestionar consultas de infracciones
- centralizar datos de personas, vehículos y casos
- organizar y almacenar documentación asociada
- asistir en la preparación y seguimiento de descargos
- mejorar la trazabilidad y el control del proceso

No se trata de un sistema de asesoramiento legal automático, sino de una herramienta de apoyo operativo.

---

## 2. Roles del sistema

### Usuario

Persona que realiza una consulta sobre infracciones y aporta la información requerida.

### Sistema

Plataforma que recibe datos, los valida, los organiza y asiste en los flujos operativos.

### Administrador

Responsable del estudio. Revisa la información, define estrategias, valida escritos y gestiona la presentación.

### Asistente

Colabora en la carga de datos, revisión de estados y seguimiento de los casos.

---

## 3. Flujo general del proceso

1. El usuario inicia una consulta
2. El sistema solicita datos mínimos
3. Se crea un caso en el sistema
4. El administrador o asistente revisa las infracciones
5. El administrador define el presupuesto
6. El usuario acepta o rechaza
7. El sistema solicita documentación adicional
8. El administrador define la estrategia
9. El sistema genera el escrito correspondiente
10. El caso se presenta y se realiza el seguimiento

---

## 4. Criterio de automatización

El sistema prioriza automatizar tareas **estructuradas y repetitivas**, por sobre aquellas que requieren criterio profesional.

En particular:

### Alta automatización

- generación de escritos
- carga y normalización de datos
- organización de casos

### Automatización asistida

- presupuestos
- decisiones estratégicas

El criterio profesional del administrador se mantiene como instancia final de validación.

---

## 5. Roadmap por capacidades funcionales

### C1 – Ingreso de datos básicos (inicio de caso)

Recepción de dominio y DNI, validación de formato y creación de caso.

**Prioridad:** Alta

**Tipo:** CRUD

---

### C2 – Gestión y persistencia de casos

Gestión completa de casos, estados, datos y documentos asociados.

**Prioridad:** Alta

**Tipo:** CRUD + workflow básico

---

### C3 – Registro de infracciones

Carga estructurada de infracciones (juzgado, tipo, fecha, velocidad, etc.).

**Prioridad:** Media / Alta

**Tipo:** CRUD con modelo específico

---

### C4 – Clasificación de infracciones

Organización y categorización automática de infracciones.

**Prioridad:** Media

**Tipo:** reglas simples

---

### C5 – Presupuesto y valuación del caso

Sugerencia de presupuesto con posibilidad de ajuste manual.

El sistema asiste, pero no reemplaza el criterio profesional.

**Prioridad:** Media

**Tipo:** lógica asistida

---

### C6 – Ingesta de documentación

Recepción y asociación de documentos (DNI, cédula verde).

**Prioridad:** Alta

**Tipo:** CRUD + storage

---

### C7 – Identidad legal del caso

Vinculación consistente entre persona, vehículo y caso.

Control de integridad de datos.

**Prioridad:** Media

**Tipo:** lógica de consistencia

---

### C8 – Selección de estrategia

Asistencia en la definición de estrategia (prescripción, nulidad, etc.).

Requiere modelado progresivo de reglas de negocio.

**Prioridad:** Media

**Tipo:** lógica de dominio (alta incertidumbre)

---

### C9 – Generación de escritos (automatización prioritaria)

Generación automática de escritos a partir de templates y datos del caso.

Incluye:

- placeholders dinámicos
- variaciones según tipo de caso
- estructura de documentos

**Prioridad:** Alta

**Tipo:** motor de templates (complejo)

---

### C10 – Presentación y seguimiento

Registro de presentación y seguimiento del estado del caso.

**Prioridad:** Media

**Tipo:** workflow

---

## 6. Presupuesto de desarrollo (Sistema Core)

Estimaciones basadas en:

- Desarrollo a medida
- Sin automatizaciones externas complejas
- Sin uso de IA
- Valor hora: USD 30

| Capacidad | Descripción | Horas | Costo |
| --- | --- | --- | --- |
| C1 | Ingreso de datos | 20 h | USD 600 |
| C2 | Gestión de casos | 30 h | USD 900 |
| C3 | Registro de infracciones | 25 h | USD 750 |
| C4 | Clasificación | 15 h | USD 450 |
| C5 | Presupuestos | 20 h | USD 600 |
| C6 | Documentación | 20 h | USD 600 |
| C7 | Identidad legal | 20 h | USD 600 |
| C8 | Estrategia | 30 h | USD 900 |
| C9 | Escritos (templates) | 35 h | USD 1.050 |
| C10 | Seguimiento | 20 h | USD 600 |

---

### Total sistema core

- **Horas:** 235
- **Costo total:** **USD 7.050**

---

### Nota sobre estimaciones

Las estimaciones contemplan la diferencia entre:

- funcionalidades estructurales (CRUD)
- lógica operativa (workflow)
- modelado de dominio (estrategia legal)
- generación dinámica de documentos

Los módulos C8 y C9 presentan mayor complejidad e incertidumbre.

---

## 7. Costos de mantenimiento y operación

### Infraestructura

- USD 20 – 40 / mes

### Mantenimiento técnico

- 5–10 horas mensuales
- USD 150 – 300

### Total mensual estimado

- **USD 170 – 340**

---

## 8. ANEXO – Canal WhatsApp

### Rol

- entrada de consultas
- recolección de datos
- canal de comunicación

---

### WhatsApp base (sin IA)

**Capacidades**

- solicitud de datos
- creación de casos
- carga de documentos
- envío de presupuestos

**Costo**

- 45 horas
- USD 1.350
- Infra: USD 5–20 / mes

---

### WhatsApp con IA (extracción de datos)

**Capacidad**

- interpretación de texto libre
- extracción de DNI y dominio

**Alcance**

- no asesora
- no decide

**Costo adicional**

- 20–30 horas
- USD 600 – 900
- Infra IA: USD 5–20 / mes

---

## 9. Presupuesto global

| Concepto | Costo |
| --- | --- |
| Sistema core | USD 7.050 |
| WhatsApp base | USD 1.350 |
| WhatsApp + IA | USD 1.950 – 2.250 |

---

## 10. Recomendación

- Implementar primero sistema core mínimo + WhatsApp sin IA
- Priorizar automatización de escritos (C9)
- Incorporar IA solo cuando exista fricción real

El objetivo es mejorar la eficiencia operativa sin perder control profesional.