import React from "react";
import { observer } from "mobx-react-lite";
import SpotMappingIcon from "../../components/icons/SpotMappingIcon";
import MainButton from "../../components/MainButton";
import ThemeColorContext from "../../ThemeColorProvider";
import RemoveIcon from "../../components/icons/RemoveIcon";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import ContainerWithSpinner from "../../components/ContainerWithSpinner";

export const SpotMappingCard = observer(({ store = {} }) => {
  const intl = useIntl();
  const themeColor = React.useContext(ThemeColorContext);

  const isWrite = store?.access === "write";
  const loading = Boolean(store?.spotMappingLoading);

  const extractedSpotsText = store?.extractedSpotsText || "";

  const grothResultUrl = store?.grothResultUrl || "#";
  const i3sResultUrl = store?.i3sResultUrl || "#";
  const scanSide = store?.selectedSpotMappingSide || "";
  const algorithmTitle = store?.spotMappingAlgorithmTitle || "";

  return (
    <div
      className="d-flex flex-column justify-content-between mt-3 mb-3"
      style={{
        padding: "20px",
        borderRadius: "10px",
        boxShadow: `0px 0px 10px rgba(0, 0, 0, 0.2)`,
        width: "100%",
      }}
    >
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div className="d-flex flex-row align-items-center mb-3">
          <SpotMappingIcon style={{ marginRight: "10px" }} />
          <h6>
            <FormattedMessage
              id="SPOT_MAPPING_ALGORITHMS"
              defaultMessage="Spot Mapping Algorithms ({algorithms})"
              values={{ algorithms: algorithmTitle }}
            />
          </h6>
        </div>
      </div>

      <ContainerWithSpinner loading={loading}>
        <div>
          {isWrite && (
            <>
              <div className="mb-4">
                <div className="mb-2" style={{ fontWeight: "bold" }}>
                  <FormattedMessage
                    id="SPOT_MAPPING"
                    defaultMessage="Spot Mapping"
                  />
                </div>
                <p className="mb-3">
                  <FormattedMessage
                    id="SPOT_MAPPING_DESCRIPTION"
                    defaultMessage="If you are not satisfied by the spot map, re-do spot mapping."
                  />
                </p>
                <MainButton
                  onClick={() => store?.startSpotMapping?.()}
                  noArrow={true}
                  color="white"
                  backgroundColor={themeColor?.wildMeColors?.cyan700}
                  borderColor={themeColor?.wildMeColors?.cyan700}
                >
                  <FormattedMessage
                    id="START_SPOT_MAPPING"
                    defaultMessage="Start Spot Mapping"
                  />
                </MainButton>
              </div>

              <div
                style={{
                  width: "100%",
                  borderBottom: "1px solid #ccc",
                  marginBottom: "20px",
                }}
              />
            </>
          )}

          <div className="mb-4" style={{ position: "relative" }}>
            <div className="mb-2" style={{ fontWeight: "bold" }}>
              <FormattedMessage
                id="EXTRACTED_SPOTS"
                defaultMessage="Extracted Spots"
              />
            </div>
            <p className="mb-0">{extractedSpotsText}</p>

            {isWrite && (
              <button
                type="button"
                className="btn p-1"
                aria-label={intl.formatMessage({
                  id: "REMOVE_EXTRACTED_SPOTS",
                  defaultMessage: "Remove extracted spots",
                })}
                title="Remove"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 0,
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  store?.removeExtractedSpots?.();
                }}
              >
                <RemoveIcon />
              </button>
            )}
          </div>

          <div
            style={{
              width: "100%",
              borderBottom: "1px solid #ccc",
              marginBottom: "20px",
            }}
          />

          <div className="mb-4">
            <div className="mb-2" style={{ fontWeight: "bold" }}>
              <FormattedMessage
                id="PATTERN_MATCHING_RESULTS"
                defaultMessage="Pattern Matching Results"
              />
            </div>

            <div className="mb-1">
              <span>Groth: </span>
              <a
                href={grothResultUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage
                  id="RIGHT_SIDE_SCAN_RESULTS"
                  defaultMessage="Right-side scan results"
                />
              </a>
            </div>

            <div>
              <span>I3S: </span>
              <a href={i3sResultUrl} target="_blank" rel="noopener noreferrer">
                <FormattedMessage
                  id="RIGHT_SIDE_SCAN_RESULTS"
                  defaultMessage="Right-side scan results"
                />
              </a>
            </div>
          </div>

          {isWrite && (
            <>
              <div
                style={{
                  width: "100%",
                  borderBottom: "1px solid #ccc",
                  marginBottom: "20px",
                }}
              />

              <div>
                <div className="mb-2" style={{ fontWeight: "bold" }}>
                  <FormattedMessage
                    id="SCAN_FOR_MATCHES"
                    defaultMessage="Scan for Matches"
                  />
                </div>

                <p className="mb-2">
                  <FormattedMessage
                    id="SCAN_ENTIRE_DATABASE_USING_ALGORITHMS"
                    defaultMessage="Scan entire database using the {groth} and {i3s} algorithms."
                    values={{
                      groth: (
                        <span
                          style={{
                            color: "#26aee4",
                            textDecoration: "underline",
                          }}
                        >
                          Modified Groth
                        </span>
                      ),
                      i3s: (
                        <span
                          style={{
                            color: "#26aee4",
                            textDecoration: "underline",
                          }}
                        >
                          I3S
                        </span>
                      ),
                    }}
                  />
                </p>

                <div className="mb-3">
                  <label
                    className="d-inline-flex align-items-center"
                    style={{ gap: 8, cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      name="spot-mapping-side"
                      checked={scanSide === "right"}
                      onChange={() =>
                        store?.setSelectedSpotMappingSide?.("right")
                      }
                      style={{
                        width: 18,
                        height: 18,
                        accentColor:
                          themeColor?.wildMeColors?.cyan700 || "#00b7e3",
                      }}
                    />
                    <span>
                      <FormattedMessage
                        id="RIGHT_SIDE"
                        defaultMessage="Right-side"
                      />
                    </span>
                  </label>
                </div>

                <MainButton
                  onClick={() => store?.startSpotMappingScan?.()}
                  noArrow={true}
                  color="white"
                  backgroundColor={themeColor?.wildMeColors?.cyan700}
                  borderColor={themeColor?.wildMeColors?.cyan700}
                >
                  <FormattedMessage
                    id="START_SCAN"
                    defaultMessage="Start Scan"
                  />
                </MainButton>
              </div>
            </>
          )}
        </div>
      </ContainerWithSpinner>
    </div>
  );
});
