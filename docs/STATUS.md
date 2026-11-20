# Estado — historia-veterinaria

perfil: app
ciclo: activo

Protocolo: `docs/status-protocol.md` del vault. Origen: triage de proyectos `F:\PROYECTOS-TRIAGE.md` (2026-11-18).

## T-001 · Commitear cambios pendientes
- status: done
- owner: claude
- verified: 2026-11-19
- evidence: 5 archivos sin commitear. 2026-11-19: commit e3fa433 pusheado (botones pill, focus visible, acento AA, DESIGN.md)
- verify: `git -C F:/products/geosdata/historia-veterinaria status --porcelain`
## T-002 · Definir canal de captación
- status: open
- owner: josse
- verified: 2026-11-18
- evidence: Live: historia-veterinaria.geosdata.com 200, sin canal definido
- verify: `curl -s -o /dev/null -w '%{http_code}' https://historia-veterinaria.geosdata.com`
