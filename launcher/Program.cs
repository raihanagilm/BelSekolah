using System;
using System.Diagnostics;
using System.IO;
using System.Net.NetworkInformation;
using System.Windows.Forms;

namespace BelSekolahLauncher {
    static class Program {
        [STAThread]
        static void Main() {
            try {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                string htmlPath = Path.Combine(baseDir, "firmware", "data", "index.html");

                // Jika folder firmware tidak langsung ada, coba cek path relatif
                if (!File.Exists(htmlPath)) {
                    htmlPath = Path.Combine(baseDir, "data", "index.html");
                }

                if (!File.Exists(htmlPath)) {
                    MessageBox.Show(
                        "File antarmuka web 'index.html' tidak ditemukan di:\n" + htmlPath,
                        "Bel Sekolah Mandiri",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Error
                    );
                    return;
                }

                // Cari browser berbasis Chromium (Edge atau Chrome)
                string browserPath = FindChromiumBrowser();

                if (!string.IsNullOrEmpty(browserPath)) {
                    ProcessStartInfo psi = new ProcessStartInfo {
                        FileName = browserPath,
                        Arguments = "--app=\"" + htmlPath + "\"",
                        UseShellExecute = false
                    };
                    Process.Start(psi);
                } else {
                    // Fallback menggunakan default browser sistem
                    Process.Start(new ProcessStartInfo {
                        FileName = htmlPath,
                        UseShellExecute = true
                    });
                }
            } catch (Exception ex) {
                MessageBox.Show(
                    "Terjadi kesalahan saat membuka aplikasi:\n" + ex.Message,
                    "Bel Sekolah Mandiri",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
            }
        }

        static string FindChromiumBrowser() {
            string progFiles = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
            string progFilesX86 = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);
            string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

            string[] candidatePaths = new string[] {
                Path.Combine(progFilesX86, "Microsoft", "Edge", "Application", "msedge.exe"),
                Path.Combine(progFiles, "Microsoft", "Edge", "Application", "msedge.exe"),
                Path.Combine(progFiles, "Google", "Chrome", "Application", "chrome.exe"),
                Path.Combine(progFilesX86, "Google", "Chrome", "Application", "chrome.exe"),
                Path.Combine(localAppData, "Google", "Chrome", "Application", "chrome.exe"),
                Path.Combine(localAppData, "Microsoft", "Edge", "Application", "msedge.exe")
            };

            foreach (string p in candidatePaths) {
                if (!string.IsNullOrEmpty(p) && File.Exists(p)) {
                    return p;
                }
            }

            return null;
        }
    }
}
