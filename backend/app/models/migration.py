from pydantic import BaseModel
from typing import Optional

class MigrationData(BaseModel):
    year: int
    country_of_asylum: str
    country_of_origin: str
    country_of_asylum_iso: str
    country_of_origin_iso: str
    refugees: Optional[int] = 0
    returned_refugees: Optional[int] = 0
    asylum_seekers: Optional[int] = 0
    idps: Optional[int] = 0
    returned_idps: Optional[int] = 0
    stateless: Optional[int] = 0
    hst: Optional[int] = 0
    ooc: Optional[int] = 0