---
name: Ömür
description: Minimalist Monolit E-Ink & Brutalist Terminal Memento Mori Yaş Sayacı ve Vizyon Panosu
colors:
  bg-ground: "#f4f4f0"
  bg-card: "#ffffff"
  bg-dark: "#0b0c0e"
  ink-primary: "#0a0a0a"
  ink-secondary: "#52524e"
  ink-muted: "#888882"
  border: "#0a0a0a"
  border-subtle: "#d2d2cc"
  accent-pulse: "#e63946"
  accent-amber: "#ff5500"
typography:
  display:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "clamp(2.4rem, 6.6vw, 6.2rem)"
    fontWeight: 800
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Work Sans, sans-serif"
    fontSize: "1.18rem"
    fontWeight: 800
  body:
    fontFamily: "Work Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "13px"
    fontWeight: 600
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "13px"
    fontWeight: 700
rounded:
  sm: "0px"
  md: "0px"
  full: "0px"
---

# Ömür Tasarım Sistemi

## Overview
Ömür, yüksek kontrastlı **E-Ink kağıt** ve **İsviçre brutalist tipografi** geleneklerinden ilham alan, her yeni tarayıcı sekmesinde kullanıcıyı zamanın kaçınılmaz akışıyla (Memento Mori) yüzleştiren bir vizyon ve hedef yönetim arayüzüdür. Üstte 9 ondalık haneli anıt boyutunda bir yaş sayacı ve hemen altında 60 Hz frekansla durmaksızın tarayan fiziksel mikro-cetvel yer alır.

## Colors
- **E-Ink Paper Ground (`#f4f4f0`)**: Göz yormayan, doğal ve sıcak mat kağıt beyazı zemin.
- **Card Ground (`#ffffff`)**: Hedef kartlarının keskin saf beyaz zemini.
- **Ink Primary (`#0a0a0a`)**: Derin karbon siyahı mürekkep; tüm ana metinler, çerçeveler ve butonlar için temel renk.
- **Ink Secondary (`#52524e`)**: İkincil etiketler, sayaç alt başlıkları ve meta bilgiler için dengeli gri ton.
- **Ink Muted (`#888882`)**: Pasif cetvel çentikleri ve tamamlanmış alt hedef metinleri.
- **Accent Pulse (`#e63946`)**: 60 Hz tarama iğnesi ve silme gibi kritik aksiyonlar için saf İsviçre kırmızısı.
- **Border Subtle (`#d2d2cc`)**: Kart içi ayırıcı çizgiler.

## Typography
- **Sayaç Rakamları & Telemetri**: `JetBrains Mono` (800 ağırlık, `tabular-nums`). Rakamlar sabit genişlikte akar, titreme veya yer değiştirme yapmaz. Sabit 9 hane ile son 3 basamak mikro-saniye akışını fiziksel bir hisle yansıtır.
- **Kart Başlıkları & Gövde**: `Work Sans` (600 ve 800 ağırlık). Karakterli, endüstriyel ve okunabilir İsviçre grotesque dengesi.
- **Etiketler & Butonlar**: `JetBrains Mono` (700 ağırlık, uppercase).

## Layout & Grid
- **Maksimum Genişlik**: 1440px merkezlenmiş mimari shell.
- **Hedefler Izgarası**: 3 sütunlu brutalist grid (`grid-template-columns: repeat(3, 1fr)`). Tablet ve mobil ekranlarda sırasıyla 2 ve 1 sütuna akıcı uyum sağlar.
- **Kategori Filtreleme**: Dinamik kategori hapları (`TÜMÜ`, `KARİYER`, `YAŞAM` vb.) ile tek tıkla kategori bazlı odaklanma.

## Key Mechanisms
1. **9 Haneli Kesintisiz Canlı Yaş Sayacı**: Doğum tarihinden itibaren geçen süreyi 9 ondalık hane hassasiyetinde (`24.184920612`) hesaplar; son basamaklar durmaksızın akar.
2. **60 Hz Mikro-Cetvel ve Tarama İğnesi**: Sayacın hemen altındaki 60 çentikli şerit ve kırmızı iğne saniyeleri fiziksel bir ibre gibi tarar.
3. **Alt Hedefler & Otomatik İlerleme**: Hedeflerin ilerleme yüzdesi manuel slider ile değil; tanımlanan alt adımların (checklists) tamamlanma oranına göre (`% = (tamamlanan / toplam) * 100`) otomatik hesaplanır. Kart üzerinden tek tıkla işaretlenebilir.
4. **Kalıcı Hedef Ekleme & Kusursuz Boş Durum (Empty State)**: Tüm hedefler silinse dahi ekranın ortasında belirgin "+ İLK HEDEFİNİZİ EKLEYİN" kartı ve en altta sabit "+ HEDEF EKLE" aksiyonu bulunur.
5. **Takvim Entegrasyonu**: Hedef tarihlerinde standart date picker açılır.
6. **Kapatılabilir Tahmini Ömür**: Kullanıcı isterse ayarlardan tahmini ömür hesaplamasını kapatabilir.
