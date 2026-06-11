/**
 * Plans Mock Data
 * ──────────────────────────────────────────────────────────────
 * Source of truth for pricing plans, segmented by:
 *   • city   — Serrinha | Teofilândia | Salvador
 *   • segment — b2c (Para Você) | b2b (Empresas)
 *
 * Each plan has a unique `id` for React keys.
 *
 * Usage:
 *   import { getPlans } from "@/data/plans";
 *   const plans = getPlans(city, segment);
 */

import type { City } from "@/contexts/LocationContext";
import type { Segment } from "@/contexts/SegmentContext";

// ── Types ───────────────────────────────────────────────────

export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  highlight: boolean;
  badge?: string;
  features: string[];
  cta: string;
}

// ── B2C Plans (Para Você) ───────────────────────────────────

const b2cSerrinha: Plan[] = [
  { id: "b2c-ser-50",  name: "50 MEGA",  price: "59",  period: "/mês", description: "Ideal para uso individual",     highlight: false, features: ["50 Mbps de download",   "25 Mbps de upload",  "Roteador Wi-Fi incluso",  "Suporte via WhatsApp"],      cta: "Assinar Plano" },
  { id: "b2c-ser-100", name: "100 MEGA", price: "79",  period: "/mês", description: "Ideal para uso básico",          highlight: false, features: ["100 Mbps de download",  "50 Mbps de upload",  "Roteador Wi-Fi incluso",  "Suporte via WhatsApp"],      cta: "Assinar Plano" },
  { id: "b2c-ser-300", name: "300 MEGA", price: "119", period: "/mês", description: "Perfeito para toda a família",   highlight: true, badge: "Mais Vendido", features: ["300 Mbps de download", "150 Mbps de upload", "Roteador Wi-Fi 6 incluso", "Suporte 24h prioritário"],   cta: "Assinar Plano" },
  { id: "b2c-ser-500", name: "500 MEGA", price: "179", period: "/mês", description: "Para quem não aceita menos",     highlight: false, features: ["500 Mbps de download",  "250 Mbps de upload", "Roteador Wi-Fi 6E incluso","IP fixo + Suporte VIP"],     cta: "Assinar Plano" },
  { id: "b2c-ser-1g",  name: "1 GIGA",   price: "249", period: "/mês", description: "Performance máxima absoluta",    highlight: false, features: ["1000 Mbps de download", "500 Mbps de upload", "Roteador Wi-Fi 6E Pro",   "IP fixo + SLA 99.9%"],       cta: "Assinar Plano" },
];

const b2cTeofilandia: Plan[] = [
  { id: "b2c-teo-50",  name: "50 MEGA",  price: "49",  period: "/mês", description: "Internet estável para o dia a dia",highlight: false, features: ["50 Mbps de download",   "25 Mbps de upload",  "Roteador Wi-Fi incluso",  "Suporte via WhatsApp"],      cta: "Assinar Plano" },
  { id: "b2c-teo-100", name: "100 MEGA", price: "69",  period: "/mês", description: "Navegação rápida para a família",  highlight: false, features: ["100 Mbps de download",  "50 Mbps de upload",  "Roteador Wi-Fi incluso",  "Suporte via WhatsApp"],      cta: "Assinar Plano" },
  { id: "b2c-teo-200", name: "200 MEGA", price: "99",  period: "/mês", description: "Streaming sem travamentos",        highlight: true, badge: "Mais Vendido", features: ["200 Mbps de download", "100 Mbps de upload", "Roteador Wi-Fi 5 incluso", "Suporte 24h prioritário"],   cta: "Assinar Plano" },
  { id: "b2c-teo-400", name: "400 MEGA", price: "139", period: "/mês", description: "Conexão turbinada",                highlight: false, features: ["400 Mbps de download",  "200 Mbps de upload", "Roteador Wi-Fi 6 incluso","IP fixo + Suporte VIP"],     cta: "Assinar Plano" },
];

const b2cSalvador: Plan[] = [
  { id: "b2c-ssa-200", name: "200 MEGA", price: "89",  period: "/mês", description: "Fibra urbana para o dia a dia",    highlight: false, features: ["200 Mbps de download",  "100 Mbps de upload", "Roteador Wi-Fi 5 incluso","Suporte via WhatsApp"],      cta: "Assinar Plano" },
  { id: "b2c-ssa-400", name: "400 MEGA", price: "129", period: "/mês", description: "Streaming + home office",           highlight: false, features: ["400 Mbps de download",  "200 Mbps de upload", "Roteador Wi-Fi 6 incluso","Suporte via WhatsApp"],      cta: "Assinar Plano" },
  { id: "b2c-ssa-600", name: "600 MEGA", price: "159", period: "/mês", description: "Alta performance para a família",   highlight: true, badge: "Mais Popular", features: ["600 Mbps de download", "300 Mbps de upload", "Roteador Wi-Fi 6 incluso","Suporte 24h prioritário"],   cta: "Assinar Plano" },
  { id: "b2c-ssa-1g",  name: "1 GIGA",   price: "199", period: "/mês", description: "Velocidade máxima na capital",      highlight: false, features: ["1000 Mbps de download", "500 Mbps de upload", "Roteador Wi-Fi 6E incluso","IP fixo + Suporte VIP"],     cta: "Assinar Plano" },
  { id: "b2c-ssa-2g",  name: "2 GIGA",   price: "299", period: "/mês", description: "Premium absoluto — gaming & 8K",    highlight: false, features: ["2000 Mbps de download", "1000 Mbps de upload","Roteador Wi-Fi 7",        "IP fixo + SLA 99.9%"],       cta: "Assinar Plano" },
];

// ── B2B Plans (Empresas) ────────────────────────────────────

const b2bSerrinha: Plan[] = [
  { id: "b2b-ser-ded1", name: "LINK DEDICADO 100",  price: "349",  period: "/mês", description: "PME — até 10 colaboradores",        highlight: false, features: ["100 Mbps simétrico",   "IP fixo dedicado",         "SLA 99.5%",               "Suporte comercial 8h–18h"],  cta: "Solicitar Proposta" },
  { id: "b2b-ser-ded2", name: "LINK DEDICADO 300",  price: "599",  period: "/mês", description: "Médias empresas + VoIP",              highlight: true, badge: "Recomendado", features: ["300 Mbps simétrico",   "IP fixo + Bloco /29",      "SLA 99.7%",               "Suporte 24h prioritário"],   cta: "Solicitar Proposta" },
  { id: "b2b-ser-ded3", name: "LINK DEDICADO 500",  price: "899",  period: "/mês", description: "Datacenter e operação contínua",      highlight: false, features: ["500 Mbps simétrico",   "IP fixo + Bloco /28",      "SLA 99.9% com SLO",       "Gerente de conta dedicado"], cta: "Solicitar Proposta" },
];

const b2bTeofilandia: Plan[] = [
  { id: "b2b-teo-ded1", name: "LINK DEDICADO 50",   price: "249",  period: "/mês", description: "Comércios e escritórios",             highlight: false, features: ["50 Mbps simétrico",    "IP fixo dedicado",         "SLA 99.0%",               "Suporte comercial 8h–18h"],  cta: "Solicitar Proposta" },
  { id: "b2b-teo-ded2", name: "LINK DEDICADO 100",  price: "399",  period: "/mês", description: "PME — até 15 colaboradores",          highlight: true, badge: "Recomendado", features: ["100 Mbps simétrico",   "IP fixo + Bloco /29",      "SLA 99.5%",               "Suporte 24h prioritário"],   cta: "Solicitar Proposta" },
  { id: "b2b-teo-ded3", name: "LINK DEDICADO 200",  price: "649",  period: "/mês", description: "Empresas com demanda alta",           highlight: false, features: ["200 Mbps simétrico",   "IP fixo + Bloco /28",      "SLA 99.7%",               "Gerente de conta dedicado"], cta: "Solicitar Proposta" },
];

const b2bSalvador: Plan[] = [
  { id: "b2b-ssa-ded1", name: "LINK DEDICADO 200",  price: "499",  period: "/mês", description: "Startups e coworkings",               highlight: false, features: ["200 Mbps simétrico",   "IP fixo dedicado",         "SLA 99.5%",               "Suporte comercial 8h–18h"],  cta: "Solicitar Proposta" },
  { id: "b2b-ssa-ded2", name: "LINK DEDICADO 500",  price: "899",  period: "/mês", description: "Operações corporativas",              highlight: true, badge: "Mais Contratado", features: ["500 Mbps simétrico",   "IP fixo + Bloco /29",      "SLA 99.7%",               "Suporte 24h + NOC"],         cta: "Solicitar Proposta" },
  { id: "b2b-ssa-ded3", name: "LINK DEDICADO 1G",   price: "1.499",period: "/mês", description: "Datacenters e empresas de tech",      highlight: false, features: ["1 Gbps simétrico",     "IP fixo + Bloco /28 + ASN","SLA 99.9% com SLO",       "Gerente de conta dedicado"], cta: "Solicitar Proposta" },
  { id: "b2b-ssa-ded4", name: "LINK DEDICADO 2G",   price: "2.499",period: "/mês", description: "Missão crítica — máxima redundância",  highlight: false, features: ["2 Gbps simétrico",     "IP fixo + BGP dedicado",   "SLA 99.99% com penalidade","NOC 24h + visita emergencial"], cta: "Solicitar Proposta" },
];

// ── Lookup table ────────────────────────────────────────────

const PLANS_MAP: Record<City, Record<Segment, Plan[]>> = {
  "Serrinha":     { b2c: b2cSerrinha,     b2b: b2bSerrinha },
  "Teofilândia":  { b2c: b2cTeofilandia,  b2b: b2bTeofilandia },
  "Salvador":     { b2c: b2cSalvador,     b2b: b2bSalvador },
};

// ── Public API ──────────────────────────────────────────────

/**
 * Returns the plans for a given city + segment combination.
 * Falls back to Serrinha B2C if something unexpected happens.
 */
export function getPlans(city: City | null, segment: Segment): Plan[] {
  if (!city) return PLANS_MAP["Serrinha"].b2c;
  return PLANS_MAP[city]?.[segment] ?? PLANS_MAP["Serrinha"].b2c;
}
