"use client";

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { GET_COUNTRY } from "../../../../lib/apollo";
import styles from "../../../../styles/CountryDetailPage.module.css";

export default function CountryDetailPage() {
  const params = useParams();
  const { currentMode } = useSelector((state) => state.mode);
  const shouldUseGraphQL = currentMode === "preview" || currentMode === "draft";

  const { loading, error, data } = useQuery(GET_COUNTRY, {
    variables: { code: params.code },
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className="loading-spinner">⟳</div>
          <p>Loading country details...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.country) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Country</h2>
          <p>{error?.message || "Country not found"}</p>
          <Link href="/graphql" className="btn btn-primary">
            Back to GraphQL Home
          </Link>
        </div>
      </div>
    );
  }

  const country = data.country;

  return (
    <div className={styles.container}>
      <div className={styles.countryCard}>
        <div className={styles.countryHeader}>
          <div className={styles.flagSection}>
            <span className={styles.emoji}>{country.emoji}</span>
            <div>
              <h2>{country.name}</h2>
              <p className={styles.code}>Code: {country.code}</p>
            </div>
          </div>
        </div>

        <div className={styles.countryDetails}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <strong>Capital:</strong>
              <span>{country.capital || "Not specified"}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Phone Code:</strong>
              <span>+{country.phone}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Currency:</strong>
              <span>{country.currency || "Not specified"}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Continent:</strong>
              <span>{country.continent.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.languagesSection}>
        <h3>Languages ({country.languages.length})</h3>
        <div className={styles.languagesGrid}>
          {country.languages.map((language) => (
            <div key={language.code} className={styles.languageCard}>
              <h4>{language.name}</h4>
              <p className={styles.languageCode}>{language.code}</p>
              <div className={styles.languageActions}>
                <Link
                  href={`/graphql/countries/${params.code}/languages/${language.code}`}
                  className="btn btn-primary"
                >
                  Explore Language
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {country.states && country.states.length > 0 && (
        <div className={styles.statesSection}>
          <h3>States/Provinces ({country.states.length})</h3>
          <div className={styles.statesGrid}>
            {country.states.slice(0, 8).map((state) => (
              <div key={state.code} className={styles.stateCard}>
                <h4>{state.name}</h4>
                <p className={styles.stateCode}>{state.code}</p>
              </div>
            ))}
          </div>
          {country.states.length > 8 && (
            <p className={styles.moreStates}>
              And {country.states.length - 8} more states...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
