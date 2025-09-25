"use client";

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { GET_COUNTRY, GET_COUNTRIES } from "../../../../../../lib/apollo";
import styles from "../../../../../../styles/LanguageDetailPage.module.css";

export default function LanguageDetailPage() {
  const params = useParams();
  const { currentMode } = useSelector((state) => state.mode);
  const shouldUseGraphQL = currentMode === "preview" || currentMode === "draft";

  // Get the specific country
  const {
    loading: countryLoading,
    error: countryError,
    data: countryData,
  } = useQuery(GET_COUNTRY, {
    variables: { code: params.code },
    skip: !shouldUseGraphQL,
    fetchPolicy: "cache-and-network",
  });

  // Get all countries to find others that use this language
  const {
    loading: countriesLoading,
    error: countriesError,
    data: countriesData,
  } = useQuery(GET_COUNTRIES, {
    skip: !shouldUseGraphQL,
    fetchPolicy: "cache-and-network",
  });

  if (!shouldUseGraphQL) {
    return (
      <div className={styles.container}>
        <div className={styles.modeMessage}>
          <h2>REST Mode Active</h2>
          <p>Switch to preview or draft mode to view GraphQL data.</p>
        </div>
      </div>
    );
  }

  if (countryLoading || countriesLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className="loading-spinner">⟳</div>
          <p>Loading language details...</p>
        </div>
      </div>
    );
  }

  if (countryError || countriesError || !countryData?.country) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Language Data</h2>
          <p>
            {countryError?.message ||
              countriesError?.message ||
              "Data not found"}
          </p>
          <Link href="/graphql" className="btn btn-primary">
            Back to GraphQL Home
          </Link>
        </div>
      </div>
    );
  }

  const country = countryData.country;
  const currentLanguage = country.languages.find(
    (lang) => lang.code === params.lang
  );

  if (!currentLanguage) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Language Not Found</h2>
          <p>
            Language &quot;{params.lang}&quot; is not spoken in {country.name}
          </p>
          <Link
            href={`/graphql/countries/${params.code}`}
            className="btn btn-primary"
          >
            Back to {country.name}
          </Link>
        </div>
      </div>
    );
  }

  // Find other countries that speak this language
  const otherCountries =
    countriesData?.countries?.filter(
      (c) =>
        c.code !== params.code &&
        c.languages.some((l) => l.code === params.lang)
    ) || [];

  // Mock detail data (since GraphQL API doesn't provide language details)
  const mockDetails = [
    { id: 1, title: `${currentLanguage.name} Grammar Rules`, type: "grammar" },
    { id: 2, title: `Common ${currentLanguage.name} Phrases`, type: "phrases" },
    { id: 3, title: `${currentLanguage.name} Writing System`, type: "writing" },
    { id: 4, title: `${currentLanguage.name} History`, type: "history" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.contextCard}>
        <div className={styles.contextHeader}>
          <span className={styles.emoji}>{country.emoji}</span>
          <div>
            <h3>{country.name}</h3>
            <p>Country Context</p>
          </div>
        </div>
      </div>

      <div className={styles.languageCard}>
        <div className={styles.languageHeader}>
          <h2>{currentLanguage.name}</h2>
          <p className={styles.languageCode}>
            Language Code: {currentLanguage.code}
          </p>
        </div>

        <div className={styles.languageInfo}>
          <div className={styles.infoItem}>
            <strong>Primary in:</strong>
            <span>{country.name}</span>
          </div>
          <div className={styles.infoItem}>
            <strong>Also spoken in:</strong>
            <span>{otherCountries.length} other countries</span>
          </div>
          <div className={styles.infoItem}>
            <strong>Total countries:</strong>
            <span>{otherCountries.length + 1}</span>
          </div>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h3>Language Details</h3>
        <div className={styles.detailsGrid}>
          {mockDetails.map((detail) => (
            <div key={detail.id} className={styles.detailCard}>
              <h4>{detail.title}</h4>
              <p className={styles.detailType}>{detail.type}</p>
              <div className={styles.detailActions}>
                <Link
                  href={`/graphql/countries/${params.code}/languages/${params.lang}/details/${detail.id}`}
                  className="btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {otherCountries.length > 0 && (
        <div className={styles.otherCountriesSection}>
          <h3>Other Countries Speaking {currentLanguage.name}</h3>
          <div className={styles.countriesGrid}>
            {otherCountries.slice(0, 6).map((otherCountry) => (
              <div key={otherCountry.code} className={styles.countryCard}>
                <span className={styles.countryEmoji}>
                  {otherCountry.emoji}
                </span>
                <div>
                  <h4>{otherCountry.name}</h4>
                  <p>{otherCountry.code}</p>
                </div>
              </div>
            ))}
          </div>
          {otherCountries.length > 6 && (
            <p className={styles.moreCountries}>
              And {otherCountries.length - 6} more countries...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
