"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import { Printer } from "lucide-react";

// Register fonts if needed (using default Helvetica for now to keep it simple)
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/Roboto-Regular.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 10,
    alignItems: "center",
  },
  logoContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  schoolInfo: {
    flex: 1,
    textAlign: "center",
  },
  schoolTitle: {
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 2,
    letterSpacing: 1,
  },
  schoolName: {
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#1e3a8a", // blue-900
    marginBottom: 4,
  },
  schoolAddress: {
    fontSize: 9,
  },
  titleContainer: {
    textAlign: "center",
    marginBottom: 20,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    textDecoration: "underline",
    marginBottom: 5,
  },
  regNo: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  mainContent: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 15,
  },
  photoContainer: {
    width: 100,
    height: 130,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  photoPlaceholder: {
    fontSize: 8,
    color: "#9ca3af",
  },
  mainTable: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: "35%",
    fontWeight: "bold",
  },
  separator: {
    width: "5%",
  },
  value: {
    width: "60%",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 8,
    marginTop: 15,
    paddingBottom: 2,
  },
  twoCol: {
    flexDirection: "row",
    gap: 20,
  },
  col: {
    flex: 1,
  },
  signatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  signatureBox: {
    alignItems: "center",
    width: 150,
  },
  signSpace: {
    height: 50,
  },
  signLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: "100%",
    marginTop: 5,
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#9ca3af",
    borderStyle: "dashed",
    textAlign: "center",
    fontSize: 8,
    color: "#6b7280",
    fontStyle: "italic",
  },
});

interface RegistrationData {
  registrationNo: string;
  namaLengkap: string;
  nisn?: string | null;
  jalurPendaftaran: string;
  pilihanJurusan1: { name: string };
  pilihanJurusan2?: { name: string } | null;
  asalSekolah: string;
  tempatLahir: string;
  tanggalLahir: Date | string;
  jenisKelamin: string;
  agama: string;
  noHp: string;
  alamatJalan: string;
  rt?: string | null;
  rw?: string | null;
  dusun?: string | null;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  namaAyah: string;
  namaIbu: string;
  noHpAyah?: string | null;
  noHpIbu?: string | null;
  fotoUrl?: string | null;
}

const RegistrationDocument = ({ data }: { data: RegistrationData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>E</Text>
        </View>
        <View style={styles.schoolInfo}>
          <Text style={styles.schoolTitle}>
            Panitia Penerimaan Peserta Didik Baru
          </Text>
          <Text style={styles.schoolName}>SMK ENSCHO</Text>
          <Text style={styles.schoolAddress}>
            Jl. Pendidikan No. 1, Jakarta Selatan
          </Text>
          <Text style={styles.schoolAddress}>
            Telp: (021) 1234567 | Email: info@enscho.sch.id
          </Text>
        </View>
      </View>

      {/* Doc Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.docTitle}>Bukti Pendaftaran Siswa Baru</Text>
        <Text style={styles.regNo}>No. Registrasi: {data.registrationNo}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Photo */}
        <View style={styles.photoContainer}>
          {data.fotoUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image
              src={
                data.fotoUrl.startsWith("/")
                  ? `${window.location.origin}${data.fotoUrl}`
                  : data.fotoUrl
              }
              style={styles.photo}
            />
          ) : (
            <Text style={styles.photoPlaceholder}>3x4</Text>
          )}
        </View>

        {/* Main Info Table */}
        <View style={styles.mainTable}>
          <View style={styles.row}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <Text style={styles.separator}>:</Text> // eslint-disable-next-line
            jsx-a11y/alt-text
            <Text style={styles.value}>{data.namaLengkap}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>NISN</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{data.nisn || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Jalur</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{data.jalurPendaftaran}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Jurusan 1</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{data.pilihanJurusan1.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Jurusan 2</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>
              {data.pilihanJurusan2?.name || "-"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Asal Sekolah</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{data.asalSekolah}</Text>
          </View>
        </View>
      </View>

      {/* Details Two Col */}
      <View style={styles.twoCol}>
        <View style={styles.col}>
          <Text style={styles.sectionTitle}>Data Pribadi</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Tempat Lahir</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{data.tempatLahir}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tgl Lahir</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>
              {new Date(data.tanggalLahir).toLocaleDateString("id-ID")}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>
              {data.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Agama</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{data.agama}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>No. HP</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.value}>{data.noHp}</Text>
          </View>
        </View>

        <View style={styles.col}>
          <Text style={styles.sectionTitle}>Alamat</Text>
          <Text>
            {data.alamatJalan}, RT {data.rt || "-"}/RW {data.rw || "-"}
          </Text>
          <Text>
            Ds. {data.desaKelurahan}, Kec. {data.kecamatan}
          </Text>
          <Text>
            {data.kabupatenKota}, {data.provinsi}
          </Text>
          <Text>Kode Pos: {data.kodePos}</Text>
        </View>
      </View>

      {/* Parents */}
      <View>
        <Text style={styles.sectionTitle}>Data Orang Tua</Text>
        <View style={styles.row}>
          <Text style={{ width: "30%", fontWeight: "bold" }}>
            Nama Ayah / Ibu
          </Text>
          <Text style={styles.separator}>:</Text>
          <Text style={styles.value}>
            {data.namaAyah} / {data.namaIbu}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ width: "30%", fontWeight: "bold" }}>Telp Ortu</Text>
          <Text style={styles.separator}>:</Text>
          <Text style={styles.value}>
            {data.noHpAyah || "-"} / {data.noHpIbu || "-"}
          </Text>
        </View>
      </View>

      {/* Signature */}
      <View style={styles.signatureContainer}>
        <View style={styles.signatureBox}>
          <Text>Siswa Pendaftar,</Text>
          <View style={styles.signSpace} />
          <Text style={{ fontWeight: "bold" }}>({data.namaLengkap})</Text>
        </View>

        <View style={styles.signatureBox}>
          <Text>
            Jakarta,{" "}
            {new Date().toLocaleDateString("id-ID", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Text>Panitia PPDB,</Text>
          <View style={styles.signSpace} />
          <Text>(...................................)</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>
          Dokumen ini dicetak otomatis melalui sistem PPDB Online Enscho. Harap
          dibawa saat verifikasi berkas.
        </Text>
      </View>
    </Page>
  </Document>
);

export default function DownloadRegistrationPdfButton({
  data,
  label = "Download Bukti Pendaftaran",
}: {
  data: any;
  label?: string;
}) {
  return (
    <div className="w-full">
      <PDFDownloadLink
        document={<RegistrationDocument data={data} />}
        fileName={`PPDB-Enscho-${data.registrationNo}.pdf`}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
      >
        {/* @ts-ignore */}
        {({ blob, url, loading, error }) => (
          <>
            <Printer size={16} />
            {loading ? "Menyiapkan PDF..." : label}
          </>
        )}
      </PDFDownloadLink>
    </div>
  );
}
