$files = @(
  @{ Src='0. Siswa Datang.mp3'; Num=1; Label='Siswa Datang / Bel Masuk' },
  @{ Src='1. Jam Pelajaran 01.mp3'; Num=2; Label='Jam Pelajaran 01' },
  @{ Src='2. Jam Pelajaran 02..mp3'; Num=3; Label='Jam Pelajaran 02' },
  @{ Src='3. Jam Pelajaran 03.mp3'; Num=4; Label='Jam Pelajaran 03' },
  @{ Src='4. Jam Pelajaran 04.mp3'; Num=5; Label='Jam Pelajaran 04' },
  @{ Src='5. Istirahat Petama.mp3'; Num=6; Label='Istirahat Pertama' },
  @{ Src='6. Jam Pelajaran 05.mp3'; Num=7; Label='Jam Pelajaran 05' },
  @{ Src='7. Jam Pelajaran 06.mp3'; Num=8; Label='Jam Pelajaran 06' },
  @{ Src='8. Jam Pelajaran 07.mp3'; Num=9; Label='Jam Pelajaran 07' },
  @{ Src='9. Jam Pelajaran 08.mp3'; Num=10; Label='Jam Pelajaran 08' },
  @{ Src='10. Istirahat Kedua.mp3'; Num=11; Label='Istirahat Kedua / Dzuhur' },
  @{ Src='11. Jam Pelajaran 09.mp3'; Num=12; Label='Jam Pelajaran 09' },
  @{ Src='12. Jam Pelajaran 10.mp3'; Num=13; Label='Jam Pelajaran 10' },
  @{ Src='13. Jam Pelajaran 11.mp3'; Num=14; Label='Jam Pelajaran 11' },
  @{ Src='14. Jam Pelajaran 12.mp3'; Num=15; Label='Jam Pelajaran 12' },
  @{ Src='15. Siswa Pulang.mp3'; Num=16; Label='Siswa Pulang / Akhir Pelajaran' },
  @{ Src='unas\1. unas - masuk ruang ujian.mp3'; Num=17; Label='Ujian: Masuk Ruang Ujian' },
  @{ Src='unas\2. unas - mulai dalam 10 menit.mp3'; Num=18; Label='Ujian: Mulai Dalam 10 Menit' },
  @{ Src='unas\3. unas - mulai ujian.mp3'; Num=19; Label='Ujian: Mulai Ujian' },
  @{ Src='unas\4. unas - selesai dalam 10 menit.mp3'; Num=20; Label='Ujian: Selesai Dalam 10 Menit' },
  @{ Src='unas\5. unas - selesai ujian.mp3'; Num=21; Label='Ujian: Selesai Ujian' }
)

foreach ($item in $files) {
  $targetName = ('{0:D4}.mp3' -f $item.Num)
  $srcPath = Join-Path 'd:\BelSekolah\temp_audio' $item.Src
  if (Test-Path $srcPath) {
    Copy-Item -Path $srcPath -Destination (Join-Path 'd:\BelSekolah\microsd_audio\mp3' $targetName) -Force
    Copy-Item -Path $srcPath -Destination (Join-Path 'd:\BelSekolah\firmware\data\audio' $targetName) -Force
    Write-Output ("Copied {0} -> {1} ({2})" -f $item.Src, $targetName, $item.Label)
  } else {
    Write-Warning ("File not found: {0}" -f $srcPath)
  }
}
