package com.xaamxaam.mapper;

import com.xaamxaam.domain.etablissement.Etablissement;
import com.xaamxaam.dto.response.EtablissementResponse;
import java.time.LocalDate;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-02T22:15:06+0000",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.20 (Eclipse Adoptium)"
)
@Component
public class EtablissementMapperImpl implements EtablissementMapper {

    @Override
    public EtablissementResponse toResponse(Etablissement etablissement) {
        if ( etablissement == null ) {
            return null;
        }

        UUID id = null;
        String nom = null;
        Etablissement.TypeEtablissement type = null;
        boolean licenceActive = false;
        LocalDate dateExpirationLicence = null;
        boolean enAttenteValidation = false;

        id = etablissement.getId();
        nom = etablissement.getNom();
        type = etablissement.getType();
        licenceActive = etablissement.isLicenceActive();
        dateExpirationLicence = etablissement.getDateExpirationLicence();
        enAttenteValidation = etablissement.isEnAttenteValidation();

        EtablissementResponse etablissementResponse = new EtablissementResponse( id, nom, type, licenceActive, dateExpirationLicence, enAttenteValidation );

        return etablissementResponse;
    }
}
